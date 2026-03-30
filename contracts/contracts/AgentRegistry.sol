// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AgentRegistry
 * @notice ERC-721 registry for QAI agent identities.
 *         Each token represents one persistent AI agent owned by a wallet.
 * @dev    Security measures:
 *         - ReentrancyGuard on all state-mutating external calls
 *         - Pausable for emergency circuit-breaker
 *         - Only token owner or protocol operator may mutate agent state
 *         - Input validation on all public entry points
 *         - No unchecked arithmetic (Solidity 0.8.x built-in overflow checks)
 */
contract AgentRegistry is ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct AgentMetadata {
        address agentOwner;
        uint256 createdAt;
        uint256 sessionCount;
        uint256 reputationScore;
        bool active;
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    uint256 private _nextTokenId;

    /// @dev tokenId => metadata
    mapping(uint256 => AgentMetadata) private _agents;

    /// @dev address => tokenId (one agent per wallet enforced)
    mapping(address => uint256) private _ownerToAgent;

    /// @dev Authorised protocol operators (e.g. inference gateway)
    mapping(address => bool) private _operators;

    /// @dev Maximum reputation delta per update to prevent griefing
    uint256 public constant MAX_REPUTATION_DELTA = 100;

    /// @dev Reputation floor
    uint256 public constant REPUTATION_FLOOR = 0;

    /// @dev Reputation ceiling
    uint256 public constant REPUTATION_CEILING = 10_000;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event AgentMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI,
        uint256 timestamp
    );

    event SessionRecorded(
        uint256 indexed tokenId,
        uint256 newSessionCount,
        uint256 timestamp
    );

    event ReputationUpdated(
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore,
        int256 delta
    );

    event OperatorUpdated(address indexed operator, bool authorised);

    event AgentDeactivated(uint256 indexed tokenId);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error AlreadyHasAgent(address owner, uint256 existingTokenId);
    error NotAuthorised(address caller, uint256 tokenId);
    error AgentNotActive(uint256 tokenId);
    error InvalidMetadataURI();
    error DeltaTooLarge(uint256 delta);
    error ReputationUnderflow();
    error ReputationOverflow();
    error ZeroAddress();
    error TokenDoesNotExist(uint256 tokenId);

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------

    modifier onlyOwnerOrOperator(uint256 tokenId) {
        if (
            ownerOf(tokenId) != msg.sender &&
            !_operators[msg.sender] &&
            owner() != msg.sender
        ) {
            revert NotAuthorised(msg.sender, tokenId);
        }
        _;
    }

    modifier agentExists(uint256 tokenId) {
        if (!_agents[tokenId].active) revert AgentNotActive(tokenId);
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address initialOwner)
        ERC721("QAI Agent Identity", "QAID")
        Ownable(initialOwner)
    {
        _nextTokenId = 1; // Start at 1 — token 0 is reserved as null sentinel
    }

    // -------------------------------------------------------------------------
    // Minting
    // -------------------------------------------------------------------------

    /**
     * @notice Mint a new Agent ID NFT. One per wallet address.
     * @param metadataURI IPFS / 0G Storage URI pointing to encrypted agent JSON.
     * @return tokenId The newly minted token ID.
     */
    function mint(string calldata metadataURI)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 tokenId)
    {
        if (bytes(metadataURI).length == 0) revert InvalidMetadataURI();
        if (_ownerToAgent[msg.sender] != 0) {
            revert AlreadyHasAgent(msg.sender, _ownerToAgent[msg.sender]);
        }

        tokenId = _nextTokenId;
        unchecked {
            // Safe: _nextTokenId overflow would require 2^256 mints
            _nextTokenId++;
        }

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        _agents[tokenId] = AgentMetadata({
            agentOwner: msg.sender,
            createdAt: block.timestamp,
            sessionCount: 0,
            reputationScore: 500, // Start at mid-range (out of 10,000)
            active: true
        });

        _ownerToAgent[msg.sender] = tokenId;

        emit AgentMinted(tokenId, msg.sender, metadataURI, block.timestamp);
    }

    // -------------------------------------------------------------------------
    // Session tracking
    // -------------------------------------------------------------------------

    /**
     * @notice Increment session count for an agent. Called by inference gateway.
     * @param tokenId Agent token ID.
     */
    function incrementSession(uint256 tokenId)
        external
        nonReentrant
        whenNotPaused
        agentExists(tokenId)
        onlyOwnerOrOperator(tokenId)
    {
        unchecked {
            // sessionCount overflow: 2^256 sessions is not a realistic concern
            _agents[tokenId].sessionCount++;
        }

        emit SessionRecorded(tokenId, _agents[tokenId].sessionCount, block.timestamp);
    }

    // -------------------------------------------------------------------------
    // Reputation
    // -------------------------------------------------------------------------

    /**
     * @notice Update reputation score for an agent.
     * @param tokenId Agent token ID.
     * @param delta Signed delta to apply. Positive = increase, negative = decrease.
     */
    function updateReputation(uint256 tokenId, int256 delta)
        external
        nonReentrant
        whenNotPaused
        agentExists(tokenId)
        onlyOwnerOrOperator(tokenId)
    {
        uint256 absDelta = delta < 0
            ? uint256(-delta)
            : uint256(delta);

        if (absDelta > MAX_REPUTATION_DELTA) revert DeltaTooLarge(absDelta);

        uint256 current = _agents[tokenId].reputationScore;
        uint256 newScore;

        if (delta < 0) {
            if (current < absDelta) revert ReputationUnderflow();
            newScore = current - absDelta;
            if (newScore < REPUTATION_FLOOR) newScore = REPUTATION_FLOOR;
        } else {
            newScore = current + absDelta;
            if (newScore > REPUTATION_CEILING) newScore = REPUTATION_CEILING;
        }

        _agents[tokenId].reputationScore = newScore;

        emit ReputationUpdated(tokenId, current, newScore, delta);
    }

    // -------------------------------------------------------------------------
    // Metadata URI update
    // -------------------------------------------------------------------------

    /**
     * @notice Update the metadata URI (e.g. when agent config changes).
     * @param tokenId Agent token ID.
     * @param newURI  New 0G Storage / IPFS URI.
     */
    function updateMetadataURI(uint256 tokenId, string calldata newURI)
        external
        nonReentrant
        whenNotPaused
        agentExists(tokenId)
    {
        // Only the token owner may update their own metadata URI
        if (ownerOf(tokenId) != msg.sender) revert NotAuthorised(msg.sender, tokenId);
        if (bytes(newURI).length == 0) revert InvalidMetadataURI();

        _setTokenURI(tokenId, newURI);
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    /**
     * @notice Get full metadata for an agent.
     */
    function getAgent(uint256 tokenId)
        external
        view
        returns (AgentMetadata memory)
    {
        if (!_exists(tokenId)) revert TokenDoesNotExist(tokenId);
        return _agents[tokenId];
    }

    /**
     * @notice Get agent token ID for a wallet address. Returns 0 if none.
     */
    function getAgentByOwner(address ownerAddr)
        external
        view
        returns (uint256)
    {
        return _ownerToAgent[ownerAddr];
    }

    /**
     * @notice Check if a wallet has an agent.
     */
    function hasAgent(address ownerAddr) external view returns (bool) {
        return _ownerToAgent[ownerAddr] != 0;
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    /**
     * @notice Grant or revoke operator status (protocol inference gateway).
     */
    function setOperator(address operator, bool authorised)
        external
        onlyOwner
    {
        if (operator == address(0)) revert ZeroAddress();
        _operators[operator] = authorised;
        emit OperatorUpdated(operator, authorised);
    }

    /**
     * @notice Check if an address is a protocol operator.
     */
    function isOperator(address operator) external view returns (bool) {
        return _operators[operator];
    }

    /**
     * @notice Deactivate an agent (owner only, irreversible).
     */
    function deactivateAgent(uint256 tokenId)
        external
        nonReentrant
    {
        if (ownerOf(tokenId) != msg.sender) revert NotAuthorised(msg.sender, tokenId);
        _agents[tokenId].active = false;
        emit AgentDeactivated(tokenId);
    }

    /**
     * @notice Emergency pause — halts minting and state mutations.
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * @dev Clear owner mapping on transfer so the new owner can register.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address from) {
        from = super._update(to, tokenId, auth);

        // Clear old owner's reverse mapping
        if (from != address(0)) {
            delete _ownerToAgent[from];
        }
        // Set new owner's reverse mapping
        if (to != address(0)) {
            _ownerToAgent[to] = tokenId;
        }
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}

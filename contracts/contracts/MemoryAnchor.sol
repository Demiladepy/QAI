// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MemoryAnchor
 * @notice Anchors session integrity hashes on-chain.
 *         Proves that a given session occurred and its content has not been
 *         tampered with — without revealing the content itself.
 *
 * @dev    sessionHash = keccak256(abi.encodePacked(agentId, userAddress, sessionContent))
 *         The pre-image (sessionContent) lives encrypted on 0G Storage.
 *         Anyone can verify integrity by re-hashing the stored content and
 *         comparing against the on-chain anchor.
 *
 *         Security measures:
 *         - Only registered operators (AgentRegistry gateway) may anchor
 *         - ReentrancyGuard on all state-mutating calls
 *         - Pausable circuit breaker
 *         - Duplicate hash detection (prevents replay anchoring)
 *         - Hard cap on sessions per agent to prevent unbounded storage growth
 */
contract MemoryAnchor is Ownable, ReentrancyGuard, Pausable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct SessionAnchor {
        bytes32 sessionHash;
        uint256 timestamp;
        address anchoredBy; // wallet address that triggered the session
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /// @dev tokenId => ordered list of session anchors
    mapping(uint256 => SessionAnchor[]) private _sessionAnchors;

    /// @dev tokenId => (sessionHash => exists) — O(1) duplicate check
    mapping(uint256 => mapping(bytes32 => bool)) private _hashExists;

    /// @dev Authorised callers (inference gateway / AgentRegistry operator)
    mapping(address => bool) private _operators;

    /// @dev Maximum sessions stored per agent to prevent unbounded growth.
    ///      Older entries are pruned when limit is reached (ring-buffer style).
    uint256 public constant MAX_SESSIONS_PER_AGENT = 1000;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event SessionAnchored(
        uint256 indexed tokenId,
        bytes32 indexed sessionHash,
        address indexed anchoredBy,
        uint256 timestamp,
        uint256 sessionIndex
    );

    event OperatorUpdated(address indexed operator, bool authorised);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error NotAuthorised(address caller);
    error ZeroHashNotAllowed();
    error DuplicateSessionHash(uint256 tokenId, bytes32 sessionHash);
    error ZeroAddress();
    error InvalidTokenId();

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------

    modifier onlyOperator() {
        if (!_operators[msg.sender] && owner() != msg.sender) {
            revert NotAuthorised(msg.sender);
        }
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address initialOwner) Ownable(initialOwner) {}

    // -------------------------------------------------------------------------
    // Core
    // -------------------------------------------------------------------------

    /**
     * @notice Anchor a session hash on-chain.
     * @param tokenId     Agent token ID from AgentRegistry.
     * @param sessionHash keccak256(abi.encodePacked(tokenId, userAddress, sessionContent)).
     * @param userAddress The wallet that participated in this session.
     */
    function anchorSession(
        uint256 tokenId,
        bytes32 sessionHash,
        address userAddress
    )
        external
        nonReentrant
        whenNotPaused
        onlyOperator
    {
        if (tokenId == 0) revert InvalidTokenId();
        if (sessionHash == bytes32(0)) revert ZeroHashNotAllowed();
        if (_hashExists[tokenId][sessionHash]) {
            revert DuplicateSessionHash(tokenId, sessionHash);
        }

        SessionAnchor[] storage anchors = _sessionAnchors[tokenId];

        // Ring-buffer pruning: remove oldest entry when cap is reached
        if (anchors.length >= MAX_SESSIONS_PER_AGENT) {
            bytes32 oldHash = anchors[0].sessionHash;
            // Shift array left by one (gas-expensive but bounded and infrequent)
            for (uint256 i = 0; i < anchors.length - 1; ) {
                anchors[i] = anchors[i + 1];
                unchecked { i++; }
            }
            anchors.pop();
            delete _hashExists[tokenId][oldHash];
        }

        anchors.push(SessionAnchor({
            sessionHash: sessionHash,
            timestamp: block.timestamp,
            anchoredBy: userAddress
        }));

        _hashExists[tokenId][sessionHash] = true;

        uint256 sessionIndex = anchors.length - 1;
        emit SessionAnchored(tokenId, sessionHash, userAddress, block.timestamp, sessionIndex);
    }

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    /**
     * @notice Get all session anchors for an agent.
     * @param tokenId Agent token ID.
     * @return Array of SessionAnchor structs in chronological order.
     */
    function getSessionHistory(uint256 tokenId)
        external
        view
        returns (SessionAnchor[] memory)
    {
        return _sessionAnchors[tokenId];
    }

    /**
     * @notice Get a paginated slice of session history.
     * @param tokenId Agent token ID.
     * @param offset  Start index.
     * @param limit   Max entries to return.
     */
    function getSessionHistoryPaginated(
        uint256 tokenId,
        uint256 offset,
        uint256 limit
    ) external view returns (SessionAnchor[] memory result) {
        SessionAnchor[] storage anchors = _sessionAnchors[tokenId];
        if (offset >= anchors.length) return new SessionAnchor[](0);

        uint256 end = offset + limit;
        if (end > anchors.length) end = anchors.length;

        result = new SessionAnchor[](end - offset);
        for (uint256 i = offset; i < end; ) {
            result[i - offset] = anchors[i];
            unchecked { i++; }
        }
    }

    /**
     * @notice Get total session count for an agent.
     */
    function getSessionCount(uint256 tokenId) external view returns (uint256) {
        return _sessionAnchors[tokenId].length;
    }

    /**
     * @notice Verify whether a given hash exists for an agent (integrity check).
     */
    function verifySession(uint256 tokenId, bytes32 sessionHash)
        external
        view
        returns (bool)
    {
        return _hashExists[tokenId][sessionHash];
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    function setOperator(address operator, bool authorised)
        external
        onlyOwner
    {
        if (operator == address(0)) revert ZeroAddress();
        _operators[operator] = authorised;
        emit OperatorUpdated(operator, authorised);
    }

    function isOperator(address operator) external view returns (bool) {
        return _operators[operator];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

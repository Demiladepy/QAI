// ============================================================
// QAI — Contract ABIs
// Generated from compiled artifacts. Keep in sync with contracts/.
// ============================================================

export const AGENT_REGISTRY_ABI = [
  // View
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getAgent",
    outputs: [
      {
        components: [
          { name: "agentOwner", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "sessionCount", type: "uint256" },
          { name: "reputationScore", type: "uint256" },
          { name: "active", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "ownerAddr", type: "address" }],
    name: "getAgentByOwner",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "ownerAddr", type: "address" }],
    name: "hasAgent",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "operator", type: "address" }],
    name: "isOperator",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Mutating
  {
    inputs: [{ name: "metadataURI", type: "string" }],
    name: "mint",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "incrementSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "delta", type: "int256" },
    ],
    name: "updateReputation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "newURI", type: "string" },
    ],
    name: "updateMetadataURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "deactivateAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "metadataURI", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "AgentMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "newSessionCount", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "SessionRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "oldScore", type: "uint256" },
      { indexed: false, name: "newScore", type: "uint256" },
      { indexed: false, name: "delta", type: "int256" },
    ],
    name: "ReputationUpdated",
    type: "event",
  },
] as const;

export const MEMORY_ANCHOR_ABI = [
  // View
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getSessionHistory",
    outputs: [
      {
        components: [
          { name: "sessionHash", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "anchoredBy", type: "address" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    name: "getSessionHistoryPaginated",
    outputs: [
      {
        components: [
          { name: "sessionHash", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "anchoredBy", type: "address" },
        ],
        name: "result",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getSessionCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "sessionHash", type: "bytes32" },
    ],
    name: "verifySession",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "sessionHash", type: "bytes32" },
      { indexed: true, name: "anchoredBy", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
      { indexed: false, name: "sessionIndex", type: "uint256" },
    ],
    name: "SessionAnchored",
    type: "event",
  },
] as const;

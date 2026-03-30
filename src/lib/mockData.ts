// ============================================================
// QAI — Mock DAO data (pre-seeded for demo / testing)
// In production, this data lives on 0G Storage KV.
// ============================================================
import type { DAO, Proposal, GovernanceDecision } from "@/types";

export const MOCK_DAOS: DAO[] = [
  {
    id: "builderDAO",
    name: "BuilderDAO",
    description: "Open-source developer collective building on 0G infrastructure.",
    memberCount: 847,
    treasuryUSD: 2_400_000,
  },
  {
    id: "defiDAO",
    name: "DefiDAO",
    description: "Decentralized finance protocol governance and liquidity coordination.",
    memberCount: 3_241,
    treasuryUSD: 18_700_000,
  },
  {
    id: "protocolDAO",
    name: "ProtocolDAO",
    description: "Core protocol parameters, contributor compensation, and partnerships.",
    memberCount: 512,
    treasuryUSD: 5_100_000,
  },
];

const now = Math.floor(Date.now() / 1000);
const DAY = 86400;

export const MOCK_PROPOSALS: Record<string, Proposal[]> = {
  builderDAO: [
    {
      id: "prop-51",
      daoId: "builderDAO",
      title: "Allocate 100,000 USDC to New Liquidity Pool",
      description:
        "Proposal to deploy 100K USDC from treasury reserves to a new 0G/USDC liquidity pool to bootstrap trading depth ahead of mainnet launch.",
      status: "active",
      votesFor: 312,
      votesAgainst: 87,
      votesAbstain: 24,
      createdAt: now - DAY * 2,
      endsAt: now + DAY * 5,
      proposer: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      conflict: {
        detected: true,
        description:
          "This proposal may conflict with Decision #47 (March 2024). The DAO previously voted to freeze all treasury allocations above 50K USDC, requiring a two-thirds supermajority vote due to market volatility. A standard majority vote is insufficient for this proposal.",
        relatedDecisionId: "decision-47",
        relatedDecisionTitle: "Emergency Treasury Freeze — Allocations > 50K USDC",
        relatedDecisionDate: now - DAY * 120,
        severity: "high",
      },
    },
    {
      id: "prop-52",
      daoId: "builderDAO",
      title: "Sponsor ETHGlobal Hackathon 2024",
      description:
        "Allocate 30,000 USDC to sponsor the ETHGlobal Bangkok hackathon as a premier track sponsor.",
      status: "active",
      votesFor: 567,
      votesAgainst: 23,
      votesAbstain: 11,
      createdAt: now - DAY,
      endsAt: now + DAY * 7,
      proposer: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9b",
    },
    {
      id: "prop-50",
      daoId: "builderDAO",
      title: "Upgrade On-Chain Voting to 0G Smart Contracts",
      description: "Migrate DAO voting infrastructure from Snapshot to on-chain contracts deployed on 0G testnet.",
      status: "passed",
      votesFor: 712,
      votesAgainst: 45,
      votesAbstain: 30,
      createdAt: now - DAY * 30,
      endsAt: now - DAY * 23,
      proposer: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6",
    },
    {
      id: "prop-49",
      daoId: "builderDAO",
      title: "Expand to Arbitrum Network",
      description: "Deploy QAI protocol contracts on Arbitrum to capture additional market share.",
      status: "rejected",
      votesFor: 189,
      votesAgainst: 654,
      votesAbstain: 78,
      createdAt: now - DAY * 60,
      endsAt: now - DAY * 53,
      proposer: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    },
  ],

  defiDAO: [
    {
      id: "prop-17",
      daoId: "defiDAO",
      title: "Increase Protocol Fee from 0.3% to 0.5%",
      description: "Proposal to increase the swap fee from 0.3% to 0.5% to fund protocol development.",
      status: "active",
      votesFor: 1243,
      votesAgainst: 2108,
      votesAbstain: 341,
      createdAt: now - DAY * 3,
      endsAt: now + DAY * 4,
      proposer: "0x7182a1b9cf4a6e969e06a8d7b6d16b8a4e0e1234",
      conflict: {
        detected: true,
        description:
          "Decision #13 (January 2024) explicitly rejected a fee increase to 0.5%, citing community concern about competitive positioning. This proposal re-introduces the same change without new supporting evidence.",
        relatedDecisionId: "decision-13",
        relatedDecisionTitle: "Rejected: Protocol Fee Increase to 0.5%",
        relatedDecisionDate: now - DAY * 180,
        severity: "medium",
      },
    },
    {
      id: "prop-16",
      daoId: "defiDAO",
      title: "Security Audit Requirement for New Pools",
      description: "All new liquidity pools above 500K TVL must pass a security audit before launch.",
      status: "passed",
      votesFor: 3102,
      votesAgainst: 89,
      votesAbstain: 50,
      createdAt: now - DAY * 45,
      endsAt: now - DAY * 38,
      proposer: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    },
  ],

  protocolDAO: [
    {
      id: "prop-11",
      daoId: "protocolDAO",
      title: "Token Buyback Programme — 200K USDC",
      description: "Use 200K USDC from treasury to buy back and burn protocol tokens at market rate.",
      status: "active",
      votesFor: 287,
      votesAgainst: 198,
      votesAbstain: 27,
      createdAt: now - DAY,
      endsAt: now + DAY * 6,
      proposer: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      conflict: {
        detected: true,
        description:
          "Decision #9 (February 2024) rejected a token buyback proposal citing insufficient treasury reserves. Current treasury levels should be reviewed before proceeding.",
        relatedDecisionId: "decision-9",
        relatedDecisionTitle: "Rejected: Token Buyback — Insufficient Reserves",
        relatedDecisionDate: now - DAY * 90,
        severity: "medium",
      },
    },
  ],
};

export const MOCK_DECISIONS: Record<string, GovernanceDecision[]> = {
  builderDAO: [
    {
      id: "decision-50",
      daoId: "builderDAO",
      title: "Passed: Governance Upgrade to On-Chain Voting",
      summary: "Migrated DAO voting to 0G smart contracts for full on-chain transparency.",
      timestamp: now - DAY * 23,
      proposalId: "prop-50",
      outcome: "passed",
      tags: ["governance", "infrastructure"],
    },
    {
      id: "decision-49",
      daoId: "builderDAO",
      title: "Rejected: Arbitrum Expansion",
      summary: "Community preferred to remain on 0G rather than dilute focus with multi-chain deployment.",
      timestamp: now - DAY * 53,
      proposalId: "prop-49",
      outcome: "rejected",
      tags: ["expansion", "network"],
    },
    {
      id: "decision-48",
      daoId: "builderDAO",
      title: "Passed: Hackathon Sponsorship 30K USDC",
      summary: "Approved 30K USDC for ETHGlobal sponsorship — under the 50K treasury freeze threshold.",
      timestamp: now - DAY * 90,
      proposalId: "prop-48",
      outcome: "passed",
      tags: ["treasury", "sponsorship"],
    },
    {
      id: "decision-47",
      daoId: "builderDAO",
      title: "Emergency Treasury Freeze — Allocations > 50K USDC",
      summary: "All treasury allocations above 50K USDC now require two-thirds supermajority. Policy currently active.",
      timestamp: now - DAY * 120,
      proposalId: "prop-47",
      outcome: "passed",
      tags: ["treasury", "emergency", "policy"],
    },
    {
      id: "decision-46",
      daoId: "builderDAO",
      title: "Rejected: Lower Quorum to 5%",
      summary: "Rejected due to security concerns about low-participation governance attacks.",
      timestamp: now - DAY * 180,
      proposalId: "prop-46",
      outcome: "rejected",
      tags: ["governance", "security"],
    },
  ],

  defiDAO: [
    {
      id: "decision-15",
      daoId: "defiDAO",
      title: "Passed: Security Audit for New Pools",
      summary: "All pools above 500K TVL require audit before launch.",
      timestamp: now - DAY * 38,
      proposalId: "prop-16",
      outcome: "passed",
      tags: ["security", "pools"],
    },
    {
      id: "decision-14",
      daoId: "defiDAO",
      title: "Passed: Q1 Liquidity Incentives",
      summary: "100K USDC allocated for Q1 liquidity mining rewards.",
      timestamp: now - DAY * 150,
      proposalId: "prop-14",
      outcome: "passed",
      tags: ["treasury", "liquidity"],
    },
    {
      id: "decision-13",
      daoId: "defiDAO",
      title: "Rejected: Fee Increase to 0.5%",
      summary: "Community rejected fee increase, citing competitive concerns against Uniswap 0.3%.",
      timestamp: now - DAY * 180,
      proposalId: "prop-13",
      outcome: "rejected",
      tags: ["fees", "policy"],
    },
  ],

  protocolDAO: [
    {
      id: "decision-10",
      daoId: "protocolDAO",
      title: "Passed: 0G Labs Partnership",
      summary: "Formal partnership for 0G storage integration — includes co-marketing and technical support.",
      timestamp: now - DAY * 60,
      proposalId: "prop-10",
      outcome: "passed",
      tags: ["partnership", "0G"],
    },
    {
      id: "decision-9",
      daoId: "protocolDAO",
      title: "Rejected: Token Buyback",
      summary: "Rejected due to insufficient treasury reserves. Treasury must reach 10M before buyback eligible.",
      timestamp: now - DAY * 90,
      proposalId: "prop-9",
      outcome: "rejected",
      tags: ["treasury", "tokenomics"],
    },
  ],
};

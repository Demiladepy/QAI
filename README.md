# QAI — Decentralized AI Identity & Memory Protocol

> Every AI agent deserves a persistent on-chain identity, cross-session memory, and private cloudless inference.

---

## The Problem

1. **AI agents are stateless by default** — every session starts fresh, erasing context, preferences, and decisions.
2. **Identity is centralized** — agent configs live on private servers. You don't own your agent.
3. **Inference is cloud-dependent** — every prompt passes through a cloud provider with access to your data.

---

## The Solution

QAI gives every AI agent three things, all built on 0G infrastructure:

| Layer | What QAI Adds | 0G Module |
|---|---|---|
| **Identity** | ERC-721 Agent ID NFT — one per wallet, on-chain forever | 0G Testnet EVM |
| **Memory** | Cross-session KV storage + permanent Log archival | 0G Storage |
| **Inference** | Cloudless LLM calls with TEE privacy guarantees | 0G Compute |

---

## 0G Integration Table

| Module | How Used | Why Necessary |
|---|---|---|
| **0G Testnet EVM** | Deploy `AgentRegistry` + `MemoryAnchor` contracts | On-chain identity and session integrity proofs |
| **0G Storage KV** | Fast reads of recent session summaries for memory injection | Enables sub-second context fetch before each inference call |
| **0G Storage Log** | Append-only full session transcript archival | Permanent audit trail and reputation source of truth |
| **0G Compute** | Routes LLM inference requests | Cloudless inference — no data leaves the decentralized network |
| **0G TEE Nodes** | (Phase 2) Private inference with ZK proof of compute | Zero-knowledge proof that inference ran correctly without leaking prompt |

---

## Architecture

```
Wallet (wagmi + RainbowKit)
        │
        ▼
 Next.js Frontend
  ├── /app    — Consumer chat + memory panel
  └── /dao    — Governance proposals + conflict detection
        │
        ▼
 /api/infer  (Next.js API Route)
  1. Verify SIWE wallet signature
  2. Verify agent ownership on-chain (AgentRegistry)
  3. Fetch memory context from 0G Storage KV
  4. Build system prompt (consumer | DAO mode)
  5. Route inference via 0G Compute
  6. Write session to 0G KV + Log layer
  7. Anchor session hash on MemoryAnchor contract
  8. Return response
        │
        ├── AgentRegistry.sol  (ERC-721 Agent IDs)
        ├── MemoryAnchor.sol   (session integrity hashes)
        └── 0G Storage         (KV fast reads + Log archival)
```

---

## Contract Addresses (0G Testnet)

After you deploy, paste the printed addresses into `.env.local` as `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS` and `NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS`, then rebuild or restart the app.

| Contract | Address (after deploy) | Explorer |
|---|---|---|
| AgentRegistry | _from `npm run contracts:deploy` output_ | `https://chainscan-galileo.0g.ai/address/<AgentRegistryAddress>` |
| MemoryAnchor | _from deploy output_ | `https://chainscan-galileo.0g.ai/address/<MemoryAnchorAddress>` |

Replace `<AgentRegistryAddress>` / `<MemoryAnchorAddress>` with your deployed contract addresses (same values as in `.env.local`).

---

## Local Setup

```bash
# 1. Clone and install
git clone <repo>
cd qai
npm install
cd contracts && npm install && cd ..

# 2. Configure environment
cp .env.local.example .env.local
# Fill in: DEPLOYER_PRIVATE_KEY, NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
#          contract addresses (after deploy), NEXT_PUBLIC_ZEROG_KV_CONTRACT,
#          INFERENCE_GATEWAY_PRIVATE_KEY, ZEROG_STORAGE_NODE_URL,
#          ZEROG_COMPUTE_ENDPOINT, optional ZEROG_COMPUTE_API_KEY

# 3. Deploy contracts (local node)
npm run contracts:deploy:local

# 4. Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Flow (3 minutes)

**Minute 1 — Consumer agent:**
1. Connect wallet → "No agent found"
2. Mint agent → confirm tx → Agent ID appears
3. Type: *"My name is Alex. I'm building a DeFi startup. Remember this."*
4. See "Memory updated" badge appear after response
5. Hard refresh → same wallet → agent greets you by context

**Minute 2 — DAO governance:**
1. Navigate to `/dao`
2. Select **BuilderDAO** → governance history loads
3. See Proposal #51: *"Allocate 100K USDC..."*
4. Conflict alert fires: *"Conflicts with Decision #47 — treasury freeze"*
5. Type: *"What did we decide about treasury limits?"* → agent answers correctly

**Minute 3 — On-chain proof:**
1. Show 0G explorer: AgentRegistry contract, minted token
2. Show MemoryAnchor: session hashes written after each interaction
3. Show 0G Storage: KV entries for this agent
4. "No cloud. No server database. Everything is verifiable on-chain."

---

## Security

- **Wallet auth only** — no email/password. SIWE signature verifies ownership before every inference call.
- **Agent ownership verified on-chain** — the inference gateway reads `AgentRegistry` to confirm the caller owns the agent.
- **Input sanitization** — all user input is sanitized and capped at 4,000 chars before reaching the LLM.
- **Rate limiting** — 20 requests per wallet per minute on the inference API.
- **No secrets in frontend** — `INFERENCE_GATEWAY_PRIVATE_KEY` is server-side only, never exposed to the browser.
- **Security headers** — CSP, X-Frame-Options, HSTS, and other headers set on every response.
- **Reentrancy guards** — all mutating contract functions are protected with `ReentrancyGuard`.
- **Pausable contracts** — emergency circuit-breaker on both contracts controlled by protocol owner.

---

## Roadmap

### Phase 2 — Protocol Launch (Months 1–6)
- Open SDK (TypeScript + Python) for third-party dApp integration
- On-chain agent reputation system (derived from session count + community ratings)
- Full TEE integration with ZK proof of compute on every session
- 10 DAO pilots with live governance memory
- Pay-per-inference metering — first protocol revenue

### Phase 3 — Marketplace + Moat (Months 6–18)
- Agent marketplace — buy, sell, fork, rent Agent IDs (5% protocol take rate)
- Cross-agent memory — agents that collaborated before remember each other
- Enterprise tier — white-label MindVault for large orgs (ACV $50K+)
- Agent composability — stack agents as sub-agents, each with their own ID and memory

---

## Team

Built for the 0G Hackathon.

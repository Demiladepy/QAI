import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`\nDeploying QAI contracts on network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // ── 1. Deploy AgentRegistry ──────────────────────────────────────────────
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy(deployer.address);
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log(`AgentRegistry deployed: ${agentRegistryAddress}`);

  // ── 2. Deploy MemoryAnchor ───────────────────────────────────────────────
  const MemoryAnchor = await ethers.getContractFactory("MemoryAnchor");
  const memoryAnchor = await MemoryAnchor.deploy(deployer.address);
  await memoryAnchor.waitForDeployment();
  const memoryAnchorAddress = await memoryAnchor.getAddress();
  console.log(`MemoryAnchor deployed:  ${memoryAnchorAddress}`);

  // ── 3. Wire up: deployer is default operator for local testing ───────────
  //     In production, set this to the inference gateway's signing address
  if (network.name === "localhost" || network.name === "hardhat") {
    await agentRegistry.setOperator(deployer.address, true);
    await memoryAnchor.setOperator(deployer.address, true);
    console.log(`\nLocal dev: deployer set as operator on both contracts.`);
  }

  // ── 4. Persist addresses ─────────────────────────────────────────────────
  const addresses = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    AgentRegistry: agentRegistryAddress,
    MemoryAnchor: memoryAnchorAddress,
    deployedAt: new Date().toISOString(),
  };

  // Write to contracts/deployments/
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  const outPath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(addresses, null, 2));
  console.log(`\nDeployment addresses saved: ${outPath}`);

  // Also write to src/lib/deployments.json for frontend consumption
  const frontendPath = path.join(__dirname, "../../src/lib/deployments.json");
  fs.writeFileSync(frontendPath, JSON.stringify(addresses, null, 2));
  console.log(`Frontend addresses updated: ${frontendPath}`);

  console.log("\n✓ Deployment complete.\n");
  console.log("Next steps:");
  console.log("  1. Add these to your .env.local:");
  console.log(`     NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=${agentRegistryAddress}`);
  console.log(`     NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS=${memoryAnchorAddress}`);
  console.log("  2. Set INFERENCE_GATEWAY_ADDRESS as operator on both contracts.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

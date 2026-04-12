import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from "path";

// Load from root .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "";
const ZEROG_TESTNET_RPC = process.env.NEXT_PUBLIC_ZEROG_RPC_URL ?? "https://evmrpc-testnet.0g.ai";

if (!DEPLOYER_PRIVATE_KEY && process.env.NODE_ENV !== "test") {
  console.warn("Warning: DEPLOYER_PRIVATE_KEY not set. Deployments will fail.");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    zerog_testnet: {
      url: ZEROG_TESTNET_RPC,
      chainId: 16601,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "../src/types/contracts",
    target: "ethers-v6",
  },
};

export default config;

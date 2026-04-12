import { expect } from "chai";
import { ethers } from "hardhat";
import { AgentRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("AgentRegistry", () => {
  let registry: AgentRegistry;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let operator: HardhatEthersSigner;

  const METADATA_URI = "0g://agent/metadata/encrypted-test-uri";

  beforeEach(async () => {
    [owner, alice, bob, operator] = await ethers.getSigners();
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    registry = await AgentRegistry.deploy(owner.address);
    await registry.waitForDeployment();
  });

  // ── Minting ────────────────────────────────────────────────────────────────

  describe("mint", () => {
    it("mints an agent NFT to the caller", async () => {
      await registry.connect(alice).mint(METADATA_URI);
      expect(await registry.ownerOf(1)).to.equal(alice.address);
    });

    it("starts session count at 0 and reputation at 500", async () => {
      await registry.connect(alice).mint(METADATA_URI);
      const agent = await registry.getAgent(1);
      expect(agent.sessionCount).to.equal(0);
      expect(agent.reputationScore).to.equal(500);
      expect(agent.active).to.be.true;
    });

    it("emits AgentMinted event", async () => {
      const tx = await registry.connect(alice).mint(METADATA_URI);
      const receipt = await tx.wait();
      const iface = registry.interface;
      const event = receipt!.logs
        .map((log) => {
          try {
            return iface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            });
          } catch {
            return undefined;
          }
        })
        .find((e) => e?.name === "AgentMinted");
      expect(event).to.not.be.undefined;
      expect(event!.args[0]).to.equal(1n);
      expect(event!.args[1]).to.equal(alice.address);
      expect(event!.args[2]).to.equal(METADATA_URI);
      const block = await ethers.provider.getBlock(receipt!.blockNumber);
      expect(event!.args[3]).to.equal(BigInt(block!.timestamp));
    });

    it("reverts when minting a second agent for same wallet", async () => {
      await registry.connect(alice).mint(METADATA_URI);
      await expect(registry.connect(alice).mint(METADATA_URI))
        .to.be.revertedWithCustomError(registry, "AlreadyHasAgent")
        .withArgs(alice.address, 1);
    });

    it("reverts with empty metadata URI", async () => {
      await expect(registry.connect(alice).mint(""))
        .to.be.revertedWithCustomError(registry, "InvalidMetadataURI");
    });

    it("reverts when paused", async () => {
      await registry.connect(owner).pause();
      await expect(registry.connect(alice).mint(METADATA_URI))
        .to.be.revertedWithCustomError(registry, "EnforcedPause");
    });

    it("correctly maps owner to tokenId", async () => {
      await registry.connect(alice).mint(METADATA_URI);
      expect(await registry.getAgentByOwner(alice.address)).to.equal(1);
      expect(await registry.hasAgent(alice.address)).to.be.true;
    });
  });

  // ── Session tracking ───────────────────────────────────────────────────────

  describe("incrementSession", () => {
    beforeEach(async () => {
      await registry.connect(alice).mint(METADATA_URI);
      await registry.connect(owner).setOperator(operator.address, true);
    });

    it("increments session count when called by owner", async () => {
      await registry.connect(alice).incrementSession(1);
      const agent = await registry.getAgent(1);
      expect(agent.sessionCount).to.equal(1);
    });

    it("increments session count when called by operator", async () => {
      await registry.connect(operator).incrementSession(1);
      const agent = await registry.getAgent(1);
      expect(agent.sessionCount).to.equal(1);
    });

    it("emits SessionRecorded event", async () => {
      const tx = await registry.connect(alice).incrementSession(1);
      const receipt = await tx.wait();
      const iface = registry.interface;
      const event = receipt!.logs
        .map((log) => {
          try {
            return iface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            });
          } catch {
            return undefined;
          }
        })
        .find((e) => e?.name === "SessionRecorded");
      expect(event).to.not.be.undefined;
      expect(event!.args[0]).to.equal(1n);
      expect(event!.args[1]).to.equal(1n);
      const block = await ethers.provider.getBlock(receipt!.blockNumber);
      expect(event!.args[2]).to.equal(BigInt(block!.timestamp));
    });

    it("reverts when called by unauthorised address", async () => {
      await expect(registry.connect(bob).incrementSession(1))
        .to.be.revertedWithCustomError(registry, "NotAuthorised");
    });
  });

  // ── Reputation ─────────────────────────────────────────────────────────────

  describe("updateReputation", () => {
    beforeEach(async () => {
      await registry.connect(alice).mint(METADATA_URI);
      await registry.connect(owner).setOperator(operator.address, true);
    });

    it("increases reputation by delta", async () => {
      await registry.connect(operator).updateReputation(1, 50);
      const agent = await registry.getAgent(1);
      expect(agent.reputationScore).to.equal(550);
    });

    it("decreases reputation by negative delta", async () => {
      await registry.connect(operator).updateReputation(1, -50);
      const agent = await registry.getAgent(1);
      expect(agent.reputationScore).to.equal(450);
    });

    it("caps at REPUTATION_CEILING", async () => {
      // Jump to near ceiling
      for (let i = 0; i < 96; i++) {
        await registry.connect(operator).updateReputation(1, 100);
      }
      const agent = await registry.getAgent(1);
      expect(agent.reputationScore).to.equal(10_000);
    });

    it("reverts when delta exceeds MAX_REPUTATION_DELTA", async () => {
      await expect(registry.connect(operator).updateReputation(1, 101))
        .to.be.revertedWithCustomError(registry, "DeltaTooLarge");
    });

    it("reverts on underflow when delta too negative", async () => {
      // Reputation is 500, reducing by 100 six times = 0
      for (let i = 0; i < 5; i++) {
        await registry.connect(operator).updateReputation(1, -100);
      }
      await expect(registry.connect(operator).updateReputation(1, -100))
        .to.be.revertedWithCustomError(registry, "ReputationUnderflow");
    });
  });

  // ── Operators ──────────────────────────────────────────────────────────────

  describe("operator management", () => {
    it("owner can set an operator", async () => {
      await registry.connect(owner).setOperator(operator.address, true);
      expect(await registry.isOperator(operator.address)).to.be.true;
    });

    it("owner can revoke an operator", async () => {
      await registry.connect(owner).setOperator(operator.address, true);
      await registry.connect(owner).setOperator(operator.address, false);
      expect(await registry.isOperator(operator.address)).to.be.false;
    });

    it("reverts on zero address", async () => {
      await expect(registry.connect(owner).setOperator(ethers.ZeroAddress, true))
        .to.be.revertedWithCustomError(registry, "ZeroAddress");
    });

    it("non-owner cannot set operators", async () => {
      await expect(registry.connect(alice).setOperator(operator.address, true))
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  // ── Transfer remapping ─────────────────────────────────────────────────────

  describe("transfer", () => {
    it("clears old owner mapping and sets new owner mapping on transfer", async () => {
      await registry.connect(alice).mint(METADATA_URI);
      await registry.connect(alice).transferFrom(alice.address, bob.address, 1);
      expect(await registry.getAgentByOwner(alice.address)).to.equal(0);
      expect(await registry.getAgentByOwner(bob.address)).to.equal(1);
    });
  });

  // ── Pause ──────────────────────────────────────────────────────────────────

  describe("pause / unpause", () => {
    it("owner can pause and unpause", async () => {
      await registry.connect(owner).pause();
      await registry.connect(owner).unpause();
      // Should not revert
    });

    it("non-owner cannot pause", async () => {
      await expect(registry.connect(alice).pause())
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });
});

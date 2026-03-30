import { expect } from "chai";
import { ethers } from "hardhat";
import { MemoryAnchor } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MemoryAnchor", () => {
  let anchor: MemoryAnchor;
  let owner: HardhatEthersSigner;
  let operator: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;

  const TOKEN_ID = 1n;

  function makeHash(tokenId: bigint, user: string, content: string): string {
    return ethers.keccak256(
      ethers.solidityPacked(["uint256", "address", "string"], [tokenId, user, content])
    );
  }

  beforeEach(async () => {
    [owner, operator, alice, attacker] = await ethers.getSigners();
    const MemoryAnchor = await ethers.getContractFactory("MemoryAnchor");
    anchor = await MemoryAnchor.deploy(owner.address);
    await anchor.waitForDeployment();
    await anchor.connect(owner).setOperator(operator.address, true);
  });

  // ── Anchoring ──────────────────────────────────────────────────────────────

  describe("anchorSession", () => {
    it("anchors a session hash", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "session content");
      await anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address);
      expect(await anchor.getSessionCount(TOKEN_ID)).to.equal(1);
    });

    it("emits SessionAnchored event", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "session content");
      await expect(anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address))
        .to.emit(anchor, "SessionAnchored")
        .withArgs(TOKEN_ID, hash, alice.address, await latestTimestamp(), 0);
    });

    it("reverts on zero hash", async () => {
      await expect(
        anchor.connect(operator).anchorSession(TOKEN_ID, ethers.ZeroHash, alice.address)
      ).to.be.revertedWithCustomError(anchor, "ZeroHashNotAllowed");
    });

    it("reverts on duplicate hash", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "same content");
      await anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address);
      await expect(
        anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address)
      ).to.be.revertedWithCustomError(anchor, "DuplicateSessionHash");
    });

    it("reverts on token ID 0", async () => {
      const hash = makeHash(0n, alice.address, "content");
      await expect(
        anchor.connect(operator).anchorSession(0, hash, alice.address)
      ).to.be.revertedWithCustomError(anchor, "InvalidTokenId");
    });

    it("reverts when caller is not operator or owner", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "content");
      await expect(
        anchor.connect(attacker).anchorSession(TOKEN_ID, hash, alice.address)
      ).to.be.revertedWithCustomError(anchor, "NotAuthorised");
    });
  });

  // ── Queries ────────────────────────────────────────────────────────────────

  describe("getSessionHistory", () => {
    it("returns all anchored sessions in order", async () => {
      for (let i = 0; i < 3; i++) {
        const hash = makeHash(TOKEN_ID, alice.address, `session ${i}`);
        await anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address);
      }
      const history = await anchor.getSessionHistory(TOKEN_ID);
      expect(history.length).to.equal(3);
    });
  });

  describe("getSessionHistoryPaginated", () => {
    it("returns correct page of results", async () => {
      for (let i = 0; i < 5; i++) {
        const hash = makeHash(TOKEN_ID, alice.address, `session ${i}`);
        await anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address);
      }
      const page = await anchor.getSessionHistoryPaginated(TOKEN_ID, 2, 2);
      expect(page.length).to.equal(2);
    });

    it("returns empty array when offset exceeds length", async () => {
      const result = await anchor.getSessionHistoryPaginated(TOKEN_ID, 100, 10);
      expect(result.length).to.equal(0);
    });
  });

  describe("verifySession", () => {
    it("returns true for existing hash", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "content");
      await anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address);
      expect(await anchor.verifySession(TOKEN_ID, hash)).to.be.true;
    });

    it("returns false for non-existent hash", async () => {
      const hash = makeHash(TOKEN_ID, alice.address, "fake content");
      expect(await anchor.verifySession(TOKEN_ID, hash)).to.be.false;
    });
  });

  // ── Pause ──────────────────────────────────────────────────────────────────

  describe("pause", () => {
    it("prevents anchoring when paused", async () => {
      await anchor.connect(owner).pause();
      const hash = makeHash(TOKEN_ID, alice.address, "content");
      await expect(
        anchor.connect(operator).anchorSession(TOKEN_ID, hash, alice.address)
      ).to.be.revertedWithCustomError(anchor, "EnforcedPause");
    });
  });

  // ── Helper ─────────────────────────────────────────────────────────────────

  async function latestTimestamp(): Promise<number> {
    const block = await ethers.provider.getBlock("latest");
    return block?.timestamp ?? 0;
  }
});

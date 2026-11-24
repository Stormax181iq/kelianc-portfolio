import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { createAuthService } from "../src/services/auth.service";
import type { AdminRepository } from "../src/repositories/types";

async function makeService() {
  const users = new Map<string, { id: number; email: string; passwordHash: string }>();
  const sessions = new Map<string, { userId: number; expiresAt: Date }>();
  let nextId = 1;
  const repo: AdminRepository = {
    async getUserByEmail(email) { return users.get(email) ?? null; },
    async createUser(email, passwordHash) {
      const u = { id: nextId++, email, passwordHash };
      users.set(email, u);
      return { id: u.id };
    },
    async createSession(userId, tokenHash, expiresAt) { sessions.set(tokenHash, { userId, expiresAt }); },
    async getSessionByTokenHash(tokenHash) { return sessions.get(tokenHash) ?? null; },
    async deleteSession(tokenHash) { sessions.delete(tokenHash); },
    async deleteExpiredSessions() {
      for (const [k, v] of sessions) if (v.expiresAt.getTime() < Date.now()) sessions.delete(k);
    },
  };
  const svc = createAuthService({ admin: repo, sessionTtlMs: 1000 });
  const { id } = await repo.createUser("admin@example.com", await svc.hashPassword("correct horse battery staple"));
  return { svc, repo, id };
}

const sha256 = (t: string) => createHash("sha256").update(t).digest("hex");

describe("auth service", () => {
  it("logs in with correct credentials and validates the token", async () => {
    const { svc, id } = await makeService();
    const token = await svc.login("admin@example.com", "correct horse battery staple");
    expect(token).toBeTruthy();
    expect(await svc.validateToken(token!)).toBe(id);
  });

  it("rejects wrong password and unknown user", async () => {
    const { svc } = await makeService();
    expect(await svc.login("admin@example.com", "wrong password")).toBeNull();
    expect(await svc.login("nobody@example.com", "whatever123")).toBeNull();
  });

  it("stores only the sha256 hash of the token, not the token itself", async () => {
    const { svc, repo } = await makeService();
    const token = (await svc.login("admin@example.com", "correct horse battery staple"))!;
    const session = await repo.getSessionByTokenHash(sha256(token));
    expect(session).toBeTruthy();
    expect(await repo.getSessionByTokenHash(token)).toBeNull();
  });

  it("expires sessions and logs out", async () => {
    const { svc } = await makeService();
    const token = (await svc.login("admin@example.com", "correct horse battery staple"))!;
    await new Promise((r) => setTimeout(r, 1100));
    expect(await svc.validateToken(token)).toBeNull();
    const token2 = (await svc.login("admin@example.com", "correct horse battery staple"))!;
    await svc.logout(token2);
    expect(await svc.validateToken(token2)).toBeNull();
  });
});

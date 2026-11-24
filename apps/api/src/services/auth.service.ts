import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";
import type { AdminRepository } from "../repositories/types";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export function createAuthService(deps: { admin: AdminRepository; sessionTtlMs?: number }) {
  const ttl = deps.sessionTtlMs ?? SESSION_TTL_MS;
  return {
    async hashPassword(password: string): Promise<string> {
      return argon2.hash(password, { type: argon2.argon2id });
    },
    /** Returns a raw session token to set as a cookie, or null on bad credentials. */
    async login(email: string, password: string): Promise<string | null> {
      const user = await deps.admin.getUserByEmail(email);
      if (!user) return null;
      const ok = await argon2.verify(user.passwordHash, password).catch(() => false);
      if (!ok) return null;
      const token = randomBytes(48).toString("hex");
      await deps.admin.createSession(user.id, hashToken(token), new Date(Date.now() + ttl));
      return token;
    },
    /** Returns the admin user id for a valid, unexpired token, else null. */
    async validateToken(token: string): Promise<number | null> {
      const session = await deps.admin.getSessionByTokenHash(hashToken(token));
      if (!session) return null;
      if (session.expiresAt.getTime() < Date.now()) {
        await deps.admin.deleteSession(hashToken(token));
        return null;
      }
      return session.userId;
    },
    async logout(token: string): Promise<void> {
      await deps.admin.deleteSession(hashToken(token));
    },
    async cleanupExpired(): Promise<void> {
      await deps.admin.deleteExpiredSessions();
    },
  };
}

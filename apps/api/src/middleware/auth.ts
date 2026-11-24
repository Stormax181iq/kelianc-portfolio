import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../lib/errors";
import type { createAuthService } from "../services/auth.service";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminUserId?: number;
    }
  }
}

export type AuthService = ReturnType<typeof createAuthService>;

export function requireAdmin(auth: AuthService, cookieName: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.[cookieName];
      if (!token || typeof token !== "string") throw unauthorized();
      const userId = await auth.validateToken(token);
      if (!userId) throw unauthorized();
      req.adminUserId = userId;
      next();
    } catch (err) {
      next(err);
    }
  };
}

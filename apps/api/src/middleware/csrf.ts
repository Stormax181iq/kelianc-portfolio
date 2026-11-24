import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";

/**
 * CSRF guard for state-changing requests: a custom header cannot be sent by a
 * cross-origin form/fetch without a CORS preflight we never grant. Combined with
 * SameSite=Lax cookies this blocks cross-site request forgery on the admin API.
 */
export function csrfGuard(req: Request, _res: Response, next: NextFunction): void {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    next();
    return;
  }
  if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
    next(new AppError(403, "csrf-rejected", "Missing X-Requested-With header"));
    return;
  }
  next();
}

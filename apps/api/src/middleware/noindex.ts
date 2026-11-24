import type { NextFunction, Request, Response } from "express";

/** The admin API must never be indexed. */
export function noindex(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
}

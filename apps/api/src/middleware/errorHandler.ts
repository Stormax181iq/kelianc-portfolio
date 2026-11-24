import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors";

/** Central error handler. Never leaks stack traces or internals to clients. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "validation-error",
        message: "Invalid input",
        issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: { code: "server-error", message: "Internal server error" } });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { code: "not-found", message: "Not found" } });
}

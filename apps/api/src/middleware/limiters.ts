import rateLimit from "express-rate-limit";
import type { Config } from "../config";

export function contactLimiter(cfg: Config) {
  return rateLimit({
    windowMs: cfg.CONTACT_RATE_LIMIT_WINDOW_MS,
    max: cfg.CONTACT_RATE_LIMIT_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: { code: "rate-limited", message: "Too many messages, please try again later" } },
  });
}

export function loginLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: { code: "rate-limited", message: "Too many login attempts, please try again later" } },
  });
}

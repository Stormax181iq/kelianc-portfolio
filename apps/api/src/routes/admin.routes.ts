import express, { Router } from "express";
import type { Services } from "../services";
import type { Repositories } from "../repositories/types";
import type { Config } from "../config";
import { createAdminController } from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/auth";
import { loginLimiter } from "../middleware/limiters";
import { asyncHandler } from "../middleware/asyncHandler";

export function createAdminRouter(deps: {
  services: Services;
  repos: Repositories;
  config: Config;
}) {
  const router = Router();
  const c = createAdminController(deps);
  // Login is public (but rate-limited); everything below requires a valid session.
  router.post("/login", loginLimiter(), asyncHandler(c.login));
  router.use(requireAdmin(deps.services.auth, deps.config.ADMIN_COOKIE_NAME));
  router.post("/logout", asyncHandler(c.logout));
  router.get("/me", asyncHandler(c.me));
  router.get("/content", asyncHandler(c.getContent));
  router.put("/content/:key", asyncHandler(c.putContent));
  router.get("/projects", asyncHandler(c.getProjects));
  router.put("/projects/:slug", asyncHandler(c.putProject));
  router.delete("/projects/:slug", asyncHandler(c.deleteProject));
  router.get("/timeline", asyncHandler(c.getTimeline));
  router.post("/timeline", asyncHandler(c.postTimeline));
  router.put("/timeline/:id", asyncHandler(c.putTimeline));
  router.delete("/timeline/:id", asyncHandler(c.deleteTimeline));
  router.get("/media", asyncHandler(c.getMedia));
  // Raw binary body for uploads (no JSON parsing on this route).
  router.post("/media", express.raw({ type: () => true, limit: "16mb" }), asyncHandler(c.postMedia));
  router.delete("/media/:id", asyncHandler(c.deleteMedia));
  router.get("/settings", asyncHandler(c.getSettings));
  router.put("/settings", asyncHandler(c.putSettings));
  return router;
}

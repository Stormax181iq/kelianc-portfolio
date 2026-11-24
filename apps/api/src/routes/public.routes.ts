import { Router } from "express";
import type { Services } from "../services";
import type { Config } from "../config";
import type { PublicSettings } from "@kelianc/shared";
import { createPublicController } from "../controllers/public.controller";
import { contactLimiter } from "../middleware/limiters";
import { asyncHandler } from "../middleware/asyncHandler";

export function createPublicRouter(deps: {
  services: Services;
  config: Config;
  settings: { getPublic(): Promise<PublicSettings> };
}) {
  const router = Router();
  const c = createPublicController(deps.services, deps.settings);
  router.get("/health", asyncHandler(c.health));
  router.get("/content", asyncHandler(c.getContent));
  router.get("/projects", asyncHandler(c.getProjects));
  router.get("/projects/:slug", asyncHandler(c.getProject));
  router.get("/timeline", asyncHandler(c.getTimeline));
  router.get("/github/repos", asyncHandler(c.getGithubRepos));
  router.get("/settings", asyncHandler(c.getSettings));
  router.post("/contact", contactLimiter(deps.config), asyncHandler(c.postContact));
  return router;
}

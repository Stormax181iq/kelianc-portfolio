import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Config } from "./config";
import { corsOrigins } from "./config";
import type { Repositories } from "./repositories/types";
import type { Services } from "./services";
import { createPublicRouter } from "./routes/public.routes";
import { createAdminRouter } from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { csrfGuard } from "./middleware/csrf";
import { noindex } from "./middleware/noindex";
import type { PublicSettings } from "@kelianc/shared";

export interface ApiDeps {
  config: Config;
  repos: Repositories;
  services: Services;
}

export function getPublicSettings(repos: Repositories): Promise<PublicSettings> {
  return repos.settings.getAll().then((all) => ({
    siteTitle: (all.siteTitle as string) ?? "Kélian Chalier — Portfolio",
    githubUsername: (all.githubUsername as string) ?? "Stormax181iq",
    githubUrl: (all.githubUrl as string) ?? "https://github.com/Stormax181iq",
    linkedinUrl: (all.linkedinUrl as string) ?? "https://www.linkedin.com/in/kelianc",
    learningPortfolioPublished: (all.learningPortfolioPublished as boolean) ?? false,
    cvEn: (all.cvEn as string | null) ?? null,
    cvFr: (all.cvFr as string | null) ?? null,
  }));
}

export function createApp(deps: ApiDeps): Express {
  const { config, repos, services } = deps;
  const app = express();
  app.set("trust proxy", 1); // behind the reverse proxy on the home server
  app.disable("x-powered-by");
  app.use(
    helmet({
      // CSP enforced in production only; disabled in dev so Vite HMR works.
      contentSecurityPolicy: config.NODE_ENV === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(cors({ origin: corsOrigins(config), credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use("/uploads", express.static(config.UPLOAD_DIR, { index: false, maxAge: "7d" }));

  app.use("/api", createPublicRouter({ services, config, settings: { getPublic: () => getPublicSettings(repos) } }));
  // Admin API: noindex + CSRF guard on mutations + session auth inside the router.
  app.use("/api/admin", noindex, csrfGuard, createAdminRouter({ services, repos, config }));

  app.use("/api", notFoundHandler);
  app.use(errorHandler);
  return app;
}

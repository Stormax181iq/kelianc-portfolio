import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { GithubRepo } from "@kelianc/shared";
import { getConfig } from "./config";
import { getPool } from "./db/pool";
import { createRepositories } from "./repositories/pg";
import { createServices } from "./services";
import { createMailer } from "./services/mailer.service";
import { createApp } from "./app";

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const config = getConfig();
  const pool = getPool();
  const repos = createRepositories(pool);
  const mailer = createMailer(config);
  const fallbackRepos = JSON.parse(
    readFileSync(resolve(here, "./fallback/github-repos.fallback.json"), "utf8"),
  ) as GithubRepo[];
  const services = createServices(repos, {
    contact: {
      mailer,
      contactTo: config.CONTACT_TO ?? null,
      fromAddress: config.RESEND_FROM ?? config.SMTP_USER ?? "no-reply@kelianc.eu",
    },
    github: {
      username: config.GITHUB_USERNAME,
      token: config.GITHUB_TOKEN,
      cacheTtlSeconds: config.GITHUB_CACHE_TTL,
      fallbackRepos,
    },
  });

  const app = createApp({ config, repos, services });
  const server = app.listen(config.API_PORT, () => {
    console.log(`API listening on http://localhost:${config.API_PORT} (${config.NODE_ENV})`);
  });

  // Housekeeping: drop expired sessions once an hour.
  const timer = setInterval(() => {
    services.auth.cleanupExpired().catch((err) => console.error("session cleanup failed:", err));
  }, 60 * 60 * 1000);
  timer.unref();

  const shutdown = () => {
    clearInterval(timer);
    server.close(() => pool.end().then(() => process.exit(0)));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

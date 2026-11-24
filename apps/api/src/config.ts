import { config as loadEnv } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
// .env lives at the repository root; real env vars always win over the file.
loadEnv({ path: resolve(here, "../../../.env") });

const boolString = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((v) => v === true || v === "true");

const envSchema = z.object({
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default("portfolio"),
  DB_USER: z.string().default("portfolio"),
  DB_PASSWORD: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SESSION_SECRET: z.string().min(32),
  ADMIN_COOKIE_NAME: z.string().default("kelianc_admin_session"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GITHUB_USERNAME: z.string().default("Stormax181iq"),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_CACHE_TTL: z.coerce.number().int().positive().default(3600),
  CONTACT_TO: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: boolString.default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),
  UPLOAD_DIR: z.string().default(resolve(here, "../uploads")),
});

export type Config = z.infer<typeof envSchema>;

let cached: Config | null = null;

export function getConfig(): Config {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const missing = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new Error(`Invalid environment configuration: ${missing}`);
    }
    cached = parsed.data;
  }
  return cached;
}

export function corsOrigins(cfg: Config = getConfig()): string[] {
  return cfg.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
}

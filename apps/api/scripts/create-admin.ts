import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import argon2 from "argon2";
import { getPool } from "../src/db/pool";

const here = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(here, "../../../.env") });

/**
 * One-off bootstrap of the initial admin account.
 * Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create --workspace=apps/api
 * The credentials live only in your shell / .env and are never committed.
 */
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment (or .env) first.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Refusing a password shorter than 12 characters.");
    process.exit(1);
  }
  const pool = getPool();
  const hash = await argon2.hash(password, { type: argon2.argon2id });
  const existing = await pool.query("SELECT id FROM admin_users WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows.length) {
    await pool.query("UPDATE admin_users SET password_hash = $2 WHERE email = $1", [email.toLowerCase(), hash]);
    console.log(`Updated password for existing admin ${email}.`);
  } else {
    await pool.query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", [email.toLowerCase(), hash]);
    console.log(`Created admin account ${email}.`);
  }
  console.log("Tip: remove ADMIN_EMAIL / ADMIN_PASSWORD from .env now that the account exists.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

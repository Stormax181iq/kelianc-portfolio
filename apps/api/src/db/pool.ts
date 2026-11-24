import pg from "pg";
import { getConfig } from "../config";

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const cfg = getConfig();
    pool = new pg.Pool({
      host: cfg.DB_HOST,
      port: cfg.DB_PORT,
      database: cfg.DB_NAME,
      user: cfg.DB_USER,
      password: cfg.DB_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }
  return pool;
}

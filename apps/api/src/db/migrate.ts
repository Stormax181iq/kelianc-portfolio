import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runner } from "node-pg-migrate";
import { getPool } from "./pool";

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await runner({
      dbClient: client,
      dir: resolve(here, "../../../../db/migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      log: () => {},
    });
    console.log("Migrations applied.");
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

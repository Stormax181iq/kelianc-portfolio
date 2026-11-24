import { getPool } from "../src/db/pool";
import { createRepositories } from "../src/repositories/pg";
import { contentBlocks, projects, timelineEvents, settings } from "./seed-data";

/** Idempotent seed: upserts all initial bilingual content. Safe to re-run. */
async function main() {
  const pool = getPool();
  const repos = createRepositories(pool);
  for (const block of contentBlocks) await repos.content.upsert(block);
  for (const project of projects) await repos.projects.upsert(project);
  for (const event of timelineEvents) await repos.timeline.upsert(event);
  for (const [key, value] of Object.entries(settings)) await repos.settings.set(key, value);
  console.log(
    `Seeded ${contentBlocks.length} content blocks, ${projects.length} projects, ${timelineEvents.length} timeline events, ${Object.keys(settings).length} settings.`,
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import type { Pool, QueryResultRow } from "pg";
import type { ContentBlock, ProjectDetail, TimelineEvent, GithubRepo } from "@kelianc/shared";
import type {
  Repositories, ContentRepository, ProjectRepository, TimelineRepository,
  MediaRepository, MediaItem, AdminRepository, ContactRepository, GithubCacheRepository, SettingsRepository,
} from "./types";

/* DB rows store each localized body as JSONB in `en` / `fr` columns.
 * Shared types expose flat LocalizedText fields, so we convert at the boundary. */

interface ProjectBody {
  title: string; summary: string; context: string; methods: string; results: string;
  skills: string[]; contribution: string | null;
  trace: { mediaPath: string | null; caption: { en: string; fr: string } } | null;
}

const rowToContent = (r: QueryResultRow): ContentBlock => ({
  key: r.key,
  value: { en: r.en, fr: r.fr },
  updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
});

const rowToProject = (r: QueryResultRow): ProjectDetail => {
  const en = r.en as ProjectBody;
  const fr = r.fr as ProjectBody;
  return {
    slug: r.slug,
    category: r.category,
    tech: r.tech,
    image: r.image ?? null,
    repoUrl: r.repo_url ?? null,
    demoUrl: r.demo_url ?? null,
    featured: r.featured,
    order: r.order,
    title: { en: en.title, fr: fr.title },
    summary: { en: en.summary, fr: fr.summary },
    context: { en: en.context, fr: fr.context },
    methods: { en: en.methods, fr: fr.methods },
    results: { en: en.results, fr: fr.results },
    skills: en.skills.map((s, i) => ({ en: s, fr: fr.skills[i] ?? s })),
    contribution: en.contribution ? { en: en.contribution, fr: fr.contribution ?? en.contribution } : null,
    trace: en.trace
      ? { mediaPath: en.trace.mediaPath, caption: { en: en.trace.caption.en, fr: fr.trace?.caption.fr ?? en.trace.caption.en } }
      : null,
  };
};

interface TimelineBody {
  title: string;
  organization: string;
  description: string;
}

const rowToTimeline = (r: QueryResultRow): TimelineEvent => {
  const en = r.en as TimelineBody;
  const fr = r.fr as TimelineBody;
  return {
    id: r.id,
    kind: r.kind,
    startDate: r.start_date,
    endDate: r.end_date ?? null,
    order: r.order,
    title: { en: en.title, fr: fr.title },
    organization: { en: en.organization, fr: fr.organization },
    description: { en: en.description, fr: fr.description },
  };
};

const projectBody = (p: ProjectDetail): { en: ProjectBody; fr: ProjectBody } => ({
  en: {
    title: p.title.en, summary: p.summary.en, context: p.context.en, methods: p.methods.en,
    results: p.results.en, skills: p.skills.map((s) => s.en),
    contribution: p.contribution?.en ?? null,
    trace: p.trace ? { mediaPath: p.trace.mediaPath, caption: { en: p.trace.caption.en, fr: p.trace.caption.fr } } : null,
  },
  fr: {
    title: p.title.fr, summary: p.summary.fr, context: p.context.fr, methods: p.methods.fr,
    results: p.results.fr, skills: p.skills.map((s) => s.fr),
    contribution: p.contribution?.fr ?? null,
    trace: p.trace ? { mediaPath: p.trace.mediaPath, caption: { en: p.trace.caption.en, fr: p.trace.caption.fr } } : null,
  },
});

function makeContent(pool: Pool): ContentRepository {
  return {
    async getAll() {
      const res = await pool.query("SELECT key, en, fr, updated_at FROM content_blocks ORDER BY key");
      return res.rows.map(rowToContent);
    },
    async getByKey(key) {
      const res = await pool.query("SELECT key, en, fr, updated_at FROM content_blocks WHERE key = $1", [key]);
      return res.rows.length ? rowToContent(res.rows[0]) : null;
    },
    async upsert(block) {
      await pool.query(
        `INSERT INTO content_blocks (key, en, fr) VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET en = EXCLUDED.en, fr = EXCLUDED.fr, updated_at = now()`,
        [block.key, JSON.stringify(block.value.en), JSON.stringify(block.value.fr)],
      );
    },
  };
}

function makeProjects(pool: Pool): ProjectRepository {
  return {
    async list() {
      const res = await pool.query('SELECT * FROM projects ORDER BY "order" ASC, created_at ASC');
      return res.rows.map(rowToProject);
    },
    async getBySlug(slug) {
      const res = await pool.query("SELECT * FROM projects WHERE slug = $1", [slug]);
      return res.rows.length ? rowToProject(res.rows[0]) : null;
    },
    async upsert(p) {
      const body = projectBody(p);
      await pool.query(
        `INSERT INTO projects (slug, category, tech, image, repo_url, demo_url, featured, "order", en, fr)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (slug) DO UPDATE SET category=EXCLUDED.category, tech=EXCLUDED.tech, image=EXCLUDED.image,
           repo_url=EXCLUDED.repo_url, demo_url=EXCLUDED.demo_url, featured=EXCLUDED.featured,
           "order"=EXCLUDED."order", en=EXCLUDED.en, fr=EXCLUDED.fr, updated_at=now()`,
        [p.slug, p.category, JSON.stringify(p.tech), p.image, p.repoUrl, p.demoUrl, p.featured, p.order,
         JSON.stringify(body.en), JSON.stringify(body.fr)],
      );
    },
    async deleteBySlug(slug) {
      const res = await pool.query("DELETE FROM projects WHERE slug = $1", [slug]);
      return (res.rowCount ?? 0) > 0;
    },
  };
}

function makeTimeline(pool: Pool): TimelineRepository {
  return {
    async list() {
      const res = await pool.query('SELECT * FROM timeline_events ORDER BY "order" ASC, start_date DESC');
      return res.rows.map(rowToTimeline);
    },
    async upsert(e) {
      const en = { title: e.title.en, organization: e.organization.en, description: e.description.en };
      const fr = { title: e.title.fr, organization: e.organization.fr, description: e.description.fr };
      if (e.id) {
        await pool.query(
          `UPDATE timeline_events SET kind=$2, start_date=$3, end_date=$4, "order"=$5, en=$6, fr=$7, updated_at=now()
           WHERE id=$1`,
          [e.id, e.kind, e.startDate, e.endDate, e.order, JSON.stringify(en), JSON.stringify(fr)],
        );
      } else {
        await pool.query(
          `INSERT INTO timeline_events (kind, start_date, end_date, "order", en, fr)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [e.kind, e.startDate, e.endDate, e.order, JSON.stringify(en), JSON.stringify(fr)],
        );
      }
    },
    async delete(id) {
      const res = await pool.query("DELETE FROM timeline_events WHERE id = $1", [id]);
      return (res.rowCount ?? 0) > 0;
    },
  };
}

function makeMedia(pool: Pool): MediaRepository {
  return {
    async create(m) {
      const res = await pool.query(
        `INSERT INTO media (filename, path, alt_en, alt_fr, mime, size) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, path`,
        [m.filename, m.path, m.altEn, m.altFr, m.mime, m.size],
      );
      return { id: res.rows[0].id, path: res.rows[0].path };
    },
    async list() {
      const res = await pool.query("SELECT id, filename, path, alt_en, alt_fr, mime, size FROM media ORDER BY created_at DESC");
      return res.rows.map((r): MediaItem => ({
        id: r.id, filename: r.filename, path: r.path, altEn: r.alt_en, altFr: r.alt_fr, mime: r.mime, size: r.size,
      }));
    },
    async delete(id) {
      const res = await pool.query("DELETE FROM media WHERE id = $1", [id]);
      return (res.rowCount ?? 0) > 0;
    },
  };
}

function makeAdmin(pool: Pool): AdminRepository {
  return {
    async getUserByEmail(email) {
      const res = await pool.query(
        'SELECT id, email, password_hash AS "passwordHash" FROM admin_users WHERE email = $1',
        [email.toLowerCase()],
      );
      return res.rows.length ? res.rows[0] : null;
    },
    async createUser(email, passwordHash) {
      const res = await pool.query(
        "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id",
        [email.toLowerCase(), passwordHash],
      );
      return { id: res.rows[0].id };
    },
    async createSession(userId, tokenHash, expiresAt) {
      await pool.query("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)", [userId, tokenHash, expiresAt]);
    },
    async getSessionByTokenHash(tokenHash) {
      const res = await pool.query(
        'SELECT user_id AS "userId", expires_at AS "expiresAt" FROM sessions WHERE token_hash = $1',
        [tokenHash],
      );
      return res.rows.length ? res.rows[0] : null;
    },
    async deleteSession(tokenHash) {
      await pool.query("DELETE FROM sessions WHERE token_hash = $1", [tokenHash]);
    },
    async deleteExpiredSessions() {
      await pool.query("DELETE FROM sessions WHERE expires_at < now()");
    },
  };
}

function makeContact(pool: Pool): ContactRepository {
  return {
    async create(msg) {
      const res = await pool.query(
        `INSERT INTO contact_messages (name, email, message, ip, user_agent) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [msg.name, msg.email, msg.message, msg.ip ?? null, msg.userAgent ?? null],
      );
      return { id: res.rows[0].id };
    },
    async markDelivered(id) {
      await pool.query("UPDATE contact_messages SET delivered = true WHERE id = $1", [id]);
    },
  };
}

function makeGithubCache(pool: Pool): GithubCacheRepository {
  return {
    async get() {
      const res = await pool.query('SELECT fetched_at AS "fetchedAt", payload FROM github_cache WHERE id = 1');
      return res.rows.length ? { fetchedAt: res.rows[0].fetchedAt, payload: res.rows[0].payload as GithubRepo[] } : null;
    },
    async set(payload) {
      await pool.query(
        `INSERT INTO github_cache (id, fetched_at, payload) VALUES (1, now(), $1)
         ON CONFLICT (id) DO UPDATE SET fetched_at = now(), payload = EXCLUDED.payload`,
        [JSON.stringify(payload)],
      );
    },
  };
}

function makeSettings(pool: Pool): SettingsRepository {
  return {
    async getAll() {
      const res = await pool.query("SELECT key, value FROM settings");
      return Object.fromEntries(res.rows.map((r) => [r.key, r.value]));
    },
    async set(key, value) {
      await pool.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, JSON.stringify(value)],
      );
    },
  };
}

export function createRepositories(pool: Pool): Repositories {
  return {
    content: makeContent(pool),
    projects: makeProjects(pool),
    timeline: makeTimeline(pool),
    media: makeMedia(pool),
    admin: makeAdmin(pool),
    contact: makeContact(pool),
    githubCache: makeGithubCache(pool),
    settings: makeSettings(pool),
  };
}

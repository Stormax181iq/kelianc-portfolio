import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS content_blocks (
      key TEXT PRIMARY KEY,
      en JSONB NOT NULL,
      fr JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL CHECK (category IN ('academic', 'personal', 'professional')),
      tech JSONB NOT NULL DEFAULT '[]'::jsonb,
      image TEXT,
      repo_url TEXT,
      demo_url TEXT,
      featured BOOLEAN NOT NULL DEFAULT false,
      "order" INTEGER NOT NULL DEFAULT 0,
      en JSONB NOT NULL,
      fr JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
      id SERIAL PRIMARY KEY,
      kind TEXT NOT NULL CHECK (kind IN ('education', 'experience', 'certification')),
      start_date TEXT NOT NULL,
      end_date TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      en JSONB NOT NULL,
      fr JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      path TEXT NOT NULL UNIQUE,
      alt_en TEXT NOT NULL DEFAULT '',
      alt_fr TEXT NOT NULL DEFAULT '',
      mime TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      delivered BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS github_cache (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      fetched_at TIMESTAMPTZ NOT NULL,
      payload JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS github_cache;
    DROP TABLE IF EXISTS contact_messages;
    DROP TABLE IF EXISTS media;
    DROP TABLE IF EXISTS timeline_events;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS content_blocks;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS admin_users;
  `);
}

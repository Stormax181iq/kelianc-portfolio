import type { ContentBlock, ProjectDetail, TimelineEvent, GithubRepo, Locale } from "@kelianc/shared";

export interface ContentRepository {
  getAll(): Promise<ContentBlock[]>;
  getByKey(key: string): Promise<ContentBlock | null>;
  upsert(block: ContentBlock): Promise<void>;
}

export interface ProjectRepository {
  list(): Promise<ProjectDetail[]>;
  getBySlug(slug: string): Promise<ProjectDetail | null>;
  upsert(project: ProjectDetail): Promise<void>;
  deleteBySlug(slug: string): Promise<boolean>;
}

export interface TimelineRepository {
  list(): Promise<TimelineEvent[]>;
  upsert(event: Omit<TimelineEvent, "id"> & { id?: number }): Promise<void>;
  delete(id: number): Promise<boolean>;
}

export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  altEn: string;
  altFr: string;
  mime: string;
  size: number;
}

export interface MediaRepository {
  create(media: Omit<MediaItem, "id" | "createdAt">): Promise<{ id: number; path: string }>;
  list(): Promise<MediaItem[]>;
  delete(id: number): Promise<boolean>;
}

export interface AdminUserRow {
  id: number;
  email: string;
  passwordHash: string;
}

export interface AdminRepository {
  getUserByEmail(email: string): Promise<AdminUserRow | null>;
  createUser(email: string, passwordHash: string): Promise<{ id: number }>;
  createSession(userId: number, tokenHash: string, expiresAt: Date): Promise<void>;
  getSessionByTokenHash(tokenHash: string): Promise<{ userId: number; expiresAt: Date } | null>;
  deleteSession(tokenHash: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
}

export interface ContactRepository {
  create(msg: { name: string; email: string; message: string; ip?: string; userAgent?: string }): Promise<{ id: number }>;
  markDelivered(id: number): Promise<void>;
}

export interface GithubCacheRepository {
  get(): Promise<{ fetchedAt: Date; payload: GithubRepo[] } | null>;
  set(payload: GithubRepo[]): Promise<void>;
}

export interface SettingsRepository {
  getAll(): Promise<Record<string, unknown>>;
  set(key: string, value: unknown): Promise<void>;
}

export interface Repositories {
  content: ContentRepository;
  projects: ProjectRepository;
  timeline: TimelineRepository;
  media: MediaRepository;
  admin: AdminRepository;
  contact: ContactRepository;
  githubCache: GithubCacheRepository;
  settings: SettingsRepository;
}

export type { Locale };

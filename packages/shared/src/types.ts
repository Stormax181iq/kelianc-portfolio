import type { Locale } from "./locales";

/** A localizable content block stored in the DB. `value` is a string or a structured object. */
export interface ContentBlock<T = unknown> {
  key: string;
  value: Record<Locale, T>;
  updatedAt: string;
}

export type ProjectCategory = "academic" | "personal" | "professional";

export interface LocalizedText {
  en: string;
  fr: string;
}

export interface ProjectSummary {
  slug: string;
  category: ProjectCategory;
  title: LocalizedText;
  summary: LocalizedText;
  tech: string[];
  image: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  order: number;
}

export interface ProjectDetail extends ProjectSummary {
  context: LocalizedText;
  methods: LocalizedText;
  results: LocalizedText;
  skills: LocalizedText[];
  contribution: LocalizedText | null;
  trace: { mediaPath: string | null; caption: LocalizedText } | null;
}

export type TimelineKind = "education" | "experience" | "certification";

export interface TimelineEvent {
  id: number;
  kind: TimelineKind;
  startDate: string;
  endDate: string | null;
  title: LocalizedText;
  organization: LocalizedText;
  description: LocalizedText;
  order: number;
}

export interface GithubRepo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string;
}

export interface GithubReposResponse {
  source: "github" | "cache" | "fallback";
  fetchedAt: string | null;
  repos: GithubRepo[];
}

export interface PublicSettings {
  siteTitle: string;
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  learningPortfolioPublished: boolean;
  cvEn: string | null;
  cvFr: string | null;
}

export interface Skill {
  name: string;
  level: "learning" | "intermediate" | "solid" | "advanced";
  levelLabel: LocalizedText;
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}

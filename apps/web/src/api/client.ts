import type { GithubReposResponse, Locale, PublicSettings } from "@kelianc/shared";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: { message?: string } }).error?.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface ContentResponse {
  locale: Locale;
  content: Record<string, unknown>;
}

export interface ProjectSummaryDto {
  slug: string;
  category: "academic" | "personal" | "professional";
  title: string;
  summary: string;
  tech: string[];
  image: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  order: number;
}

export interface ProjectDetailDto extends ProjectSummaryDto {
  context: string;
  methods: string;
  results: string;
  skills: string[];
  contribution: string | null;
  trace: { mediaPath: string | null; caption: string } | null;
}

export interface TimelineEventDto {
  id: number;
  kind: "education" | "experience" | "certification";
  startDate: string;
  endDate: string | null;
  title: string;
  organization: string;
  description: string;
  order: number;
}

export const api = {
  content: (locale: Locale) => get<ContentResponse>(`/api/content?locale=${locale}`),
  settings: () => get<PublicSettings>("/api/settings"),
  projects: (locale: Locale) => get<{ projects: ProjectSummaryDto[] }>(`/api/projects?locale=${locale}`),
  project: (slug: string, locale: Locale) => get<{ project: ProjectDetailDto }>(`/api/projects/${encodeURIComponent(slug)}?locale=${locale}`),
  timeline: (locale: Locale) => get<{ events: TimelineEventDto[] }>(`/api/timeline?locale=${locale}`),
  githubRepos: () => get<GithubReposResponse>("/api/github/repos"),
  contact: (body: unknown) =>
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as { error?: { message?: string } }).error?.message ?? `Request failed: ${res.status}`);
      return json as { accepted: boolean };
    }),
};

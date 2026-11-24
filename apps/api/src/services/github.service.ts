import type { GithubRepo, GithubReposResponse } from "@kelianc/shared";
import type { GithubCacheRepository } from "../repositories/types";

export type Fetcher = (url: string, init?: { headers?: Record<string, string> }) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

export interface GithubServiceDeps {
  cache: GithubCacheRepository;
  username: string;
  token?: string;
  cacheTtlSeconds: number;
  fallbackRepos: GithubRepo[];
  fetcher?: Fetcher;
  now?: () => Date;
  maxRepos?: number;
}

interface RawRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

const defaultFetcher: Fetcher = async (url, init) => {
  const res = await fetch(url, { headers: init?.headers });
  return { ok: res.ok, status: res.status, json: () => res.json() };
};

export function createGithubService(deps: GithubServiceDeps) {
  const fetcher = deps.fetcher ?? defaultFetcher;
  const now = deps.now ?? (() => new Date());
  const maxRepos = deps.maxRepos ?? 12;

  async function fetchFromGithub(): Promise<GithubRepo[]> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "kelianc-portfolio",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (deps.token) headers.Authorization = `Bearer ${deps.token}`;
    const res = await fetcher(
      `https://api.github.com/users/${encodeURIComponent(deps.username)}/repos?per_page=100&sort=updated`,
      { headers },
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const raw = (await res.json()) as RawRepo[];
    return raw
      .filter((r) => !r.fork)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, maxRepos)
      .map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      }));
  }

  return {
    /** Cache-first with TTL; on GitHub failure serve stale cache, else a static fallback. */
    async getRepos(): Promise<GithubReposResponse> {
      const cached = await deps.cache.get();
      const fresh =
        cached && now().getTime() - cached.fetchedAt.getTime() < deps.cacheTtlSeconds * 1000;
      if (fresh && cached) {
        return { source: "cache", fetchedAt: cached.fetchedAt.toISOString(), repos: cached.payload };
      }
      try {
        const repos = await fetchFromGithub();
        await deps.cache.set(repos);
        return { source: "github", fetchedAt: now().toISOString(), repos };
      } catch (err) {
        console.error("GitHub fetch failed, degrading gracefully:", (err as Error).message);
        if (cached) {
          return { source: "cache", fetchedAt: cached.fetchedAt.toISOString(), repos: cached.payload };
        }
        return { source: "fallback", fetchedAt: null, repos: deps.fallbackRepos };
      }
    },
  };
}

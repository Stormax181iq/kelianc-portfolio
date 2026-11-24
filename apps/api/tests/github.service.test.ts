import { describe, expect, it, vi } from "vitest";
import { createGithubService, type Fetcher } from "../src/services/github.service";
import type { GithubCacheRepository } from "../src/repositories/types";
import type { GithubRepo } from "@kelianc/shared";

const fallback: GithubRepo[] = [
  { name: "fallback-repo", fullName: "u/fallback-repo", description: null, url: "https://x", language: null, stars: 0, updatedAt: "2026-01-01T00:00:00Z" },
];

function fakeCache(initial?: { fetchedAt: Date; payload: GithubRepo[] }) {
  let stored = initial ?? null;
  return {
    get stored() { return stored; },
    async get() { return stored; },
    async set(payload: GithubRepo[]) { stored = { fetchedAt: new Date(), payload }; },
  } as GithubCacheRepository & { stored: typeof stored };
}

const apiRepos = [
  { name: "b", full_name: "u/b", description: null, html_url: "https://b", language: "TS", stargazers_count: 5, updated_at: "2026-06-01T00:00:00Z", fork: false },
  { name: "a", full_name: "u/a", description: "d", html_url: "https://a", language: "Python", stargazers_count: 1, updated_at: "2026-05-01T00:00:00Z", fork: false },
  { name: "forked", full_name: "u/forked", description: null, html_url: "https://f", language: null, stargazers_count: 0, updated_at: "2026-07-01T00:00:00Z", fork: true },
];

const okFetcher: Fetcher = async () => ({ ok: true, status: 200, json: async () => apiRepos });
const failFetcher: Fetcher = async () => ({ ok: false, status: 500, json: async () => ({}) });

describe("github service", () => {
  it("fetches from GitHub, filters forks, sorts by update date and caches", async () => {
    const cache = fakeCache();
    const svc = createGithubService({
      cache, username: "u", cacheTtlSeconds: 3600, fallbackRepos: fallback, fetcher: okFetcher,
      now: () => new Date("2026-06-10T00:00:00Z"),
    });
    const res = await svc.getRepos();
    expect(res.source).toBe("github");
    expect(res.repos.map((r) => r.name)).toEqual(["b", "a"]);
    expect(cache.stored?.payload).toHaveLength(2);
  });

  it("serves fresh cache without hitting the API", async () => {
    const payload: GithubRepo[] = [{ name: "cached", fullName: "u/cached", description: null, url: "u", language: null, stars: 0, updatedAt: "2026-01-01T00:00:00Z" }];
    const cache = fakeCache({ fetchedAt: new Date("2026-06-10T00:00:00Z"), payload });
    const fetcher = vi.fn();
    const svc = createGithubService({
      cache, username: "u", cacheTtlSeconds: 3600, fallbackRepos: fallback,
      fetcher: fetcher as unknown as Fetcher, now: () => new Date("2026-06-10T00:30:00Z"),
    });
    const res = await svc.getRepos();
    expect(res.source).toBe("cache");
    expect(res.repos[0]?.name).toBe("cached");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("serves stale cache when GitHub fails", async () => {
    const payload: GithubRepo[] = [{ name: "stale", fullName: "u/stale", description: null, url: "u", language: null, stars: 0, updatedAt: "2026-01-01T00:00:00Z" }];
    const cache = fakeCache({ fetchedAt: new Date("2026-06-01T00:00:00Z"), payload });
    const svc = createGithubService({
      cache, username: "u", cacheTtlSeconds: 3600, fallbackRepos: fallback, fetcher: failFetcher,
      now: () => new Date("2026-06-10T00:00:00Z"),
    });
    const res = await svc.getRepos();
    expect(res.source).toBe("cache");
    expect(res.repos[0]?.name).toBe("stale");
  });

  it("falls back to the static list when GitHub fails and there is no cache", async () => {
    const cache = fakeCache();
    const svc = createGithubService({
      cache, username: "u", cacheTtlSeconds: 3600, fallbackRepos: fallback, fetcher: failFetcher,
      now: () => new Date("2026-06-10T00:00:00Z"),
    });
    const res = await svc.getRepos();
    expect(res.source).toBe("fallback");
    expect(res.fetchedAt).toBeNull();
    expect(res.repos[0]?.name).toBe("fallback-repo");
  });
});

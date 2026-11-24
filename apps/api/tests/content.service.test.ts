import { describe, expect, it } from "vitest";
import { createContentService } from "../src/services/content.service";
import type { ContentRepository } from "../src/repositories/types";
import type { ContentBlock } from "@kelianc/shared";

const blocks: ContentBlock[] = [
  { key: "nav", value: { en: { home: "Home" }, fr: { home: "Accueil" } }, updatedAt: "2026-01-01T00:00:00Z" },
  { key: "only-en", value: { en: { a: 1 }, fr: undefined as never }, updatedAt: "2026-01-01T00:00:00Z" },
];

const repo: ContentRepository = {
  async getAll() { return blocks; },
  async getByKey(key) { return blocks.find((b) => b.key === key) ?? null; },
  async upsert() {},
};

describe("content service", () => {
  it("returns the requested locale", async () => {
    const svc = createContentService(repo);
    const fr = await svc.getPublic("fr");
    expect(fr.nav).toEqual({ home: "Accueil" });
  });

  it("falls back to the default locale when a translation is missing", async () => {
    const svc = createContentService(repo);
    const fr = await svc.getPublic("fr");
    expect(fr["only-en"]).toEqual({ a: 1 });
  });
});

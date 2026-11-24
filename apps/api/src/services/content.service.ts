import { DEFAULT_LOCALE, type ContentBlock, type Locale } from "@kelianc/shared";
import type { ContentRepository } from "../repositories/types";

export function createContentService(repo: ContentRepository) {
  return {
    /** Public, single-locale view: key -> localized value, falling back to the default locale. */
    async getPublic(locale: Locale): Promise<Record<string, unknown>> {
      const blocks = await repo.getAll();
      const out: Record<string, unknown> = {};
      for (const b of blocks) {
        out[b.key] = b.value[locale] ?? b.value[DEFAULT_LOCALE];
      }
      return out;
    },
    async getAllLocalized(): Promise<ContentBlock[]> {
      return repo.getAll();
    },
    async upsert(block: ContentBlock): Promise<void> {
      await repo.upsert(block);
    },
  };
}

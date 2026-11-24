import { DEFAULT_LOCALE, type Locale, type TimelineEvent, type TimelineUpsert } from "@kelianc/shared";
import type { TimelineRepository } from "../repositories/types";

export interface LocalizedTimelineEvent {
  id: number;
  kind: TimelineEvent["kind"];
  startDate: string;
  endDate: string | null;
  title: string;
  organization: string;
  description: string;
  order: number;
}

const pick = (t: { en: string; fr: string }, locale: Locale): string => t[locale] ?? t[DEFAULT_LOCALE];

export function createTimelineService(repo: TimelineRepository) {
  return {
    async listLocalized(locale: Locale): Promise<LocalizedTimelineEvent[]> {
      const all = await repo.list();
      return all.map((e) => ({
        id: e.id,
        kind: e.kind,
        startDate: e.startDate,
        endDate: e.endDate,
        order: e.order,
        title: pick(e.title, locale),
        organization: pick(e.organization, locale),
        description: pick(e.description, locale),
      }));
    },
    async listAll(): Promise<TimelineEvent[]> {
      return repo.list();
    },
    async upsert(input: TimelineUpsert, id?: number): Promise<void> {
      await repo.upsert({ ...input, id });
    },
    async delete(id: number): Promise<boolean> {
      return repo.delete(id);
    },
  };
}

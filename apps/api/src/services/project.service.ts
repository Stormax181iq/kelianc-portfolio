import { DEFAULT_LOCALE, type Locale, type ProjectDetail, type ProjectUpsert, type ProjectCategory } from "@kelianc/shared";
import type { ProjectRepository } from "../repositories/types";

/** API responses are already localized to the requested locale (plain strings). */
export interface LocalizedProjectSummary {
  slug: string;
  category: ProjectCategory;
  title: string;
  summary: string;
  tech: string[];
  image: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  order: number;
}

export interface LocalizedProjectDetail extends LocalizedProjectSummary {
  context: string;
  methods: string;
  results: string;
  skills: string[];
  contribution: string | null;
  trace: { mediaPath: string | null; caption: string } | null;
}

const pick = (t: { en: string; fr: string }, locale: Locale): string => t[locale] ?? t[DEFAULT_LOCALE];

export function createProjectService(repo: ProjectRepository) {
  const toSummary = (p: ProjectDetail, locale: Locale): LocalizedProjectSummary => ({
    slug: p.slug,
    category: p.category,
    title: pick(p.title, locale),
    summary: pick(p.summary, locale),
    tech: p.tech,
    image: p.image,
    repoUrl: p.repoUrl,
    demoUrl: p.demoUrl,
    featured: p.featured,
    order: p.order,
  });

  return {
    async listSummaries(locale: Locale): Promise<LocalizedProjectSummary[]> {
      return (await repo.list()).map((p) => toSummary(p, locale));
    },
    async listAll(): Promise<ProjectDetail[]> {
      return repo.list();
    },
    async getDetail(slug: string, locale: Locale): Promise<LocalizedProjectDetail | null> {
      const p = await repo.getBySlug(slug);
      if (!p) return null;
      return {
        ...toSummary(p, locale),
        context: pick(p.context, locale),
        methods: pick(p.methods, locale),
        results: pick(p.results, locale),
        skills: p.skills.map((s) => pick(s, locale)),
        contribution: p.contribution ? pick(p.contribution, locale) : null,
        trace: p.trace ? { mediaPath: p.trace.mediaPath, caption: pick(p.trace.caption, locale) } : null,
      };
    },
    async upsert(input: ProjectUpsert): Promise<void> {
      const detail: ProjectDetail = {
        slug: input.slug,
        category: input.category,
        tech: input.tech,
        image: input.image || null,
        repoUrl: input.repoUrl || null,
        demoUrl: input.demoUrl || null,
        featured: input.featured,
        order: input.order,
        title: input.title,
        summary: input.summary,
        context: input.context,
        methods: input.methods,
        results: input.results,
        skills: input.skills,
        contribution: input.contribution,
        trace: input.traceCaption
          ? { mediaPath: input.traceMediaPath ?? null, caption: input.traceCaption }
          : null,
      };
      await repo.upsert(detail);
    },
    async delete(slug: string): Promise<boolean> {
      return repo.deleteBySlug(slug);
    },
  };
}

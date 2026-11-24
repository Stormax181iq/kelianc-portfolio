import { z } from "zod";
import { LOCALES } from "./locales";

export const localeSchema = z.enum(LOCALES);

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "name-too-short").max(120),
  email: z.string().trim().email("email-invalid").max(254),
  message: z.string().trim().min(10, "message-too-short").max(5000),
  /** Honeypot field: humans never see or fill it. The service silently drops
   *  submissions where it is filled instead of returning an error. */
  website: z.string().max(500).optional().default(""),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(256),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contentBlockUpdateSchema = z.object({
  key: z.string().min(1).max(200),
  en: z.unknown(),
  fr: z.unknown(),
});

export const projectCategorySchema = z.enum(["academic", "personal", "professional"]);

const localizedText = z.object({ en: z.string(), fr: z.string() });

export const projectUpsertSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "slug-invalid"),
  category: projectCategorySchema,
  title: localizedText,
  summary: localizedText,
  tech: z.array(z.string().max(60)).max(20),
  image: z.string().max(500).nullable(),
  repoUrl: z.string().url().nullable().or(z.literal("")),
  demoUrl: z.string().url().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  context: localizedText,
  methods: localizedText,
  results: localizedText,
  skills: z.array(localizedText).max(30),
  contribution: localizedText.nullable(),
  traceMediaPath: z.string().max(500).nullable(),
  traceCaption: localizedText.nullable(),
});
export type ProjectUpsert = z.infer<typeof projectUpsertSchema>;

export const timelineKindSchema = z.enum(["education", "experience", "certification"]);

export const timelineUpsertSchema = z.object({
  kind: timelineKindSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "date-invalid"),
  endDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "date-invalid").nullable(),
  title: localizedText,
  organization: localizedText,
  description: localizedText,
  order: z.number().int().default(0),
});
export type TimelineUpsert = z.infer<typeof timelineUpsertSchema>;

export const settingsUpdateSchema = z.object({
  learningPortfolioPublished: z.boolean().optional(),
  cvEn: z.string().max(500).nullable().optional(),
  cvFr: z.string().max(500).nullable().optional(),
});

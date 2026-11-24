import { describe, expect, it } from "vitest";
import { contactFormSchema, loginSchema, projectUpsertSchema } from "../src/schemas";

describe("contactFormSchema", () => {
  const valid = { name: "Jane Doe", email: "jane@example.com", message: "Hello, this is a test message." };
  it("accepts a valid payload with empty honeypot", () => {
    expect(contactFormSchema.parse({ ...valid, website: "" }).message).toBe(valid.message);
  });
  it("accepts a filled honeypot at schema level (the service drops it silently)", () => {
    expect(contactFormSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(contactFormSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("rejects a too-short message", () => {
    expect(contactFormSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a valid email and a password of at least 8 chars", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "short" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.co", password: "long-enough" }).success).toBe(true);
  });
});

describe("projectUpsertSchema", () => {
  it("rejects invalid slugs", () => {
    const base = {
      slug: "Bad Slug!", category: "personal", title: { en: "t", fr: "t" }, summary: { en: "s", fr: "s" },
      tech: [], image: null, repoUrl: "", demoUrl: "", featured: false, order: 0,
      context: { en: "c", fr: "c" }, methods: { en: "m", fr: "m" }, results: { en: "r", fr: "r" },
      skills: [], contribution: null, traceMediaPath: null, traceCaption: null,
    };
    expect(projectUpsertSchema.safeParse(base).success).toBe(false);
    expect(projectUpsertSchema.safeParse({ ...base, slug: "parloir-blog" }).success).toBe(true);
  });
});

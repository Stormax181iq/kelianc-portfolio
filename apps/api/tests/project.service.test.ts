import { describe, expect, it } from "vitest";
import { createProjectService } from "../src/services/project.service";
import type { ProjectRepository } from "../src/repositories/types";
import type { ProjectDetail } from "@kelianc/shared";

const project: ProjectDetail = {
  slug: "demo",
  category: "personal",
  title: { en: "Demo", fr: "Démo" },
  summary: { en: "A demo project", fr: "Un projet démo" },
  tech: ["TypeScript"],
  image: null,
  repoUrl: "https://github.com/u/demo",
  demoUrl: null,
  featured: true,
  order: 1,
  context: { en: "Context EN", fr: "Contexte FR" },
  methods: { en: "Methods EN", fr: "Méthodes FR" },
  results: { en: "Results EN", fr: "Résultats FR" },
  skills: [{ en: "React", fr: "React" }, { en: "SQL", fr: "SQL" }],
  contribution: { en: "I did everything", fr: "J'ai tout fait" },
  trace: { mediaPath: "/uploads/demo.png", caption: { en: "Screenshot", fr: "Capture" } },
};

const repo: ProjectRepository = {
  async list() { return [project]; },
  async getBySlug(slug) { return slug === project.slug ? project : null; },
  async upsert() {},
  async deleteBySlug(slug) { return slug === project.slug; },
};

describe("project service", () => {
  it("localizes summaries to the requested locale", async () => {
    const svc = createProjectService(repo);
    const fr = await svc.listSummaries("fr");
    expect(fr[0]?.title).toBe("Démo");
    const en = await svc.listSummaries("en");
    expect(en[0]?.title).toBe("Demo");
  });

  it("localizes the full detail including skills and trace caption", async () => {
    const svc = createProjectService(repo);
    const detail = await svc.getDetail("demo", "fr");
    expect(detail?.context).toBe("Contexte FR");
    expect(detail?.skills).toEqual(["React", "SQL"]);
    expect(detail?.contribution).toBe("J'ai tout fait");
    expect(detail?.trace?.caption).toBe("Capture");
  });

  it("returns null for an unknown slug", async () => {
    const svc = createProjectService(repo);
    expect(await svc.getDetail("nope", "en")).toBeNull();
  });

  it("maps an upsert input to a stored detail, dropping empty optional fields", async () => {
    let stored: ProjectDetail | null = null;
    const capturing: ProjectRepository = {
      ...repo,
      async upsert(p) { stored = p; },
    };
    const svc = createProjectService(capturing);
    await svc.upsert({
      slug: "x",
      category: "academic",
      title: { en: "T", fr: "T" },
      summary: { en: "S", fr: "S" },
      tech: [],
      image: "",
      repoUrl: "",
      demoUrl: "",
      featured: false,
      order: 0,
      context: { en: "", fr: "" },
      methods: { en: "", fr: "" },
      results: { en: "", fr: "" },
      skills: [],
      contribution: null,
      traceMediaPath: null,
      traceCaption: null,
    });
    expect(stored).not.toBeNull();
    expect(stored!.image).toBeNull();
    expect(stored!.repoUrl).toBeNull();
    expect(stored!.trace).toBeNull();
  });
});

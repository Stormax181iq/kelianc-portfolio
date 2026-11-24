import { describe, expect, it, beforeAll } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// jsdom lacks matchMedia (used by the theme provider).
beforeAll(() => {
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

const content = {
  meta: { title: "Test", description: "Test portfolio" },
  nav: {
    home: "Home", about: "About", projects: "Projects", beyond: "Beyond code",
    learning: "Learning", contact: "Contact", openTerminal: "Terminal",
    skipToContent: "Skip to content", switchLanguage: "FR", toggleTheme: "Theme",
    openMenu: "Menu", closeMenu: "Close",
  },
  "home.hero": { greeting: "Hi", name: "Kélian Chalier", role: "Student", pitch: "Pitch", ctaProjects: "Projects", ctaContact: "Contact" },
  "home.sections": { featuredTitle: "Featured", featuredSubtitle: "", viewAllProjects: "All projects", skillsTitle: "Skills", skillsSubtitle: "", githubTitle: "GitHub", githubSubtitle: "" },
  skills: [{ name: "TypeScript", level: "solid", levelLabel: "Solid" }],
  "projects.page": { title: "Projects", readMore: "Read more", filterAll: "All", filterAcademic: "Academic", filterPersonal: "Personal", filterProfessional: "Professional", empty: "None" },
  "about.page": { title: "About", lead: "Lead", paragraphs: ["P1"], vision: ["V1"], languages: [{ name: "English", level: "C1" }], cvLabel: "CV" },
  "beyond.page": { title: "Beyond code", sections: [{ title: "Singing", text: "Text" }] },
  "contact.page": { title: "Contact", intro: "Intro", nameLabel: "Name", emailLabel: "Email", messageLabel: "Message", submitLabel: "Send", success: "Sent", error: "Error" },
  "learning.page": { title: "Learning", note: "Note" },
  footer: { rights: "Rights", github: "GitHub", linkedin: "LinkedIn" },
  terminal: { welcome: "Welcome", help: "Help", whoami: "Me", contact: "Contact", unknownCommand: "Unknown", cleared: "Cleared" },
  errors: { notFoundTitle: "Not found", notFoundText: "This page does not exist.", backHome: "Back home" },
  "timeline.labels": { education: "Education", experience: "Experience", certification: "Certifications", present: "Present" },
};

const projects = {
  locale: "en",
  projects: [
    { slug: "demo", category: "personal", title: "Demo", summary: "A demo", tech: ["TypeScript"], image: null, repoUrl: null, demoUrl: null, featured: true, order: 1 },
  ],
};

const projectDetail = { locale: "en", project: { ...projects.projects[0], context: "C", methods: "M", results: "R", skills: ["React"], contribution: null, trace: null } };

const originalFetch = globalThis.fetch;
globalThis.fetch = (async (url: string | URL | Request) => {
  const u = String(url);
  const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
  if (u.includes("/api/content")) return json({ locale: "en", content });
  if (u.includes("/api/settings")) return json({ siteTitle: "T", githubUsername: "u", githubUrl: "https://github.com/u", linkedinUrl: "https://linkedin.com/in/u", learningPortfolioPublished: false, cvEn: null, cvFr: null });
  if (u.includes("/api/projects/demo")) return json(projectDetail);
  if (u.includes("/api/projects")) return json(projects);
  if (u.includes("/api/timeline")) return json({ locale: "en", events: [] });
  if (u.includes("/api/github/repos")) return json({ source: "fallback", fetchedAt: null, repos: [] });
  return originalFetch(url);
}) as typeof fetch;

async function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  await waitFor(() => expect(document.querySelector("#main")).not.toBeNull(), { timeout: 5000 });
  await waitFor(() => expect(document.querySelector("#main")!.textContent!.length).toBeGreaterThan(10), { timeout: 5000 });
}

describe("App smoke (all routes render without crashing)", () => {
  it("renders home at /en", async () => {
    await renderAt("/en");
    expect((await screen.findAllByText("Kélian Chalier")).length).toBeGreaterThan(0);
  });

  it("renders home at /fr", async () => {
    await renderAt("/fr");
  });

  it.each([
    "/en/about",
    "/en/projects",
    "/en/projects/demo",
    "/en/beyond",
    "/en/learning",
    "/en/contact",
    "/en/nope",
  ])("renders %s without crashing", async (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.querySelector("#main")!.textContent!.length).toBeGreaterThan(5), { timeout: 8000 });
    cleanup();
  }, 10000);
});

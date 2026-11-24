import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { ContentProvider } from "../i18n/ContentContext";

// Minimal fetch stub: the provider fetches /api/content and /api/settings.
const content = {
  "projects.page": { readMore: "Read more", filterAcademic: "Academic" },
};
globalThis.fetch = (async (url: string) => {
  if (url.startsWith("/api/content")) {
    return { ok: true, json: async () => ({ locale: "en", content }) } as Response;
  }
  return { ok: true, json: async () => ({}) } as Response;
}) as typeof fetch;

const project = {
  slug: "parloir-blog",
  category: "personal" as const,
  title: "Parloir blog",
  summary: "A personal blog engine.",
  tech: ["TypeScript", "React"],
  image: null,
  repoUrl: "https://github.com/Stormax181iq/parloir-blog",
  demoUrl: null,
  featured: true,
  order: 2,
};

describe("ProjectCard", () => {
  it("renders title, summary, tech chips and a link to the detail page", async () => {
    render(
      <MemoryRouter initialEntries={["/en/projects"]}>
        <ContentProvider locale="en">
          <ProjectCard project={project} />
        </ContentProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Parloir blog")).toBeInTheDocument();
    expect(screen.getByText("A personal blog engine.")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    const link = screen.getAllByRole("link", { name: /Parloir blog|Read more/ })[0];
    if (!link) throw new Error("project link not found");
    expect(link.getAttribute("href")).toBe("/en/projects/parloir-blog");
  });
});

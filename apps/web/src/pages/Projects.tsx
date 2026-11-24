import { useEffect, useMemo, useState } from "react";
import { useContent } from "../i18n/ContentContext";
import { api, type ProjectSummaryDto } from "../api/client";
import ProjectCard from "../components/ProjectCard";

type Filter = "all" | "academic" | "personal" | "professional";

export default function Projects() {
  const { locale, t } = useContent();
  const page = t<Record<string, string>>("projects.page");
  const [projects, setProjects] = useState<ProjectSummaryDto[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    api.projects(locale).then((r) => setProjects(r.projects)).catch(() => {});
  }, [locale]);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter],
  );

  const filters: Array<[Filter, string]> = [
    ["all", page.filterAll ?? "All"],
    ["academic", page.filterAcademic ?? "Academic"],
    ["personal", page.filterPersonal ?? "Personal"],
    ["professional", page.filterProfessional ?? "Professional"],
  ];

  return (
    <div className="page">
      <h1>{page.title}</h1>
      <p className="lead">{page.subtitle}</p>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map(([f, label]) => (
          <button
            key={f}
            className={filter === f ? "chip active" : "chip"}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="muted">{page.empty}</p>
      ) : (
        <div className="project-grid">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

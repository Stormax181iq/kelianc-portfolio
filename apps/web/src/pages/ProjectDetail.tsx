import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";
import { api, type ProjectDetailDto } from "../api/client";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { locale, t } = useContent();
  const page = t<Record<string, string>>("projects.page");
  const [project, setProject] = useState<ProjectDetailDto | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api
      .project(slug, locale)
      .then((r) => setProject(r.project))
      .catch(() => setMissing(true));
  }, [slug, locale]);

  if (missing) {
    return (
      <div className="page narrow">
        <h1>{page.notFound}</h1>
        <p>
          <Link to={`/${locale}/projects`}>← {page.backToProjects}</Link>
        </p>
      </div>
    );
  }
  if (!project) return <div className="page narrow">…</div>;

  return (
    <div className="page narrow">
      <p>
        <Link to={`/${locale}/projects`}>← {page.backToProjects}</Link>
      </p>
      <span className={`badge badge-${project.category}`}>{project.category}</span>
      <h1>{project.title}</h1>
      <p className="lead">{project.summary}</p>
      <ul className="tech-chips">
        {project.tech.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>
      <div className="project-links">
        {project.repoUrl && (
          <a className="button button-ghost" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            {page.viewRepo}
          </a>
        )}
        {project.demoUrl && (
          <a className="button button-ghost" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            {page.viewDemo}
          </a>
        )}
      </div>

      <h2>{page.contextTitle}</h2>
      <p>{project.context}</p>
      <h2>{page.methodsTitle}</h2>
      <p>{project.methods}</p>
      <h2>{page.resultsTitle}</h2>
      <p>{project.results}</p>
      <h2>{page.skillsTitle}</h2>
      <ul className="skill-list">
        {project.skills.map((s) => (
          <li key={s} className="skill-item">
            <span className="skill-name">{s}</span>
          </li>
        ))}
      </ul>
      {project.contribution && (
        <>
          <h2>{page.contributionTitle}</h2>
          <p>{project.contribution}</p>
        </>
      )}
      {project.trace && (
        <>
          <h2>{page.traceTitle}</h2>
          {project.trace.mediaPath && (
            <figure>
              <img src={project.trace.mediaPath} alt={project.trace.caption} loading="lazy" />
              <figcaption>{project.trace.caption}</figcaption>
            </figure>
          )}
          {!project.trace.mediaPath && <p className="muted">{project.trace.caption}</p>}
        </>
      )}
    </div>
  );
}

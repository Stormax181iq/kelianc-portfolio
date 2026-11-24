import { Link } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";
import type { ProjectSummaryDto } from "../api/client";

export default function ProjectCard({ project }: { project: ProjectSummaryDto }) {
  const { locale, t } = useContent();
  const page = t<Record<string, string>>("projects.page");
  return (
    <article className="project-card">
      {project.image && (
        <Link to={`/${locale}/projects/${project.slug}`}>
          <img src={project.image} alt="" loading="lazy" />
        </Link>
      )}
      <div className="project-card-body">
        <span className={`badge badge-${project.category}`}>
          {page[`filter${project.category.charAt(0).toUpperCase()}${project.category.slice(1)}`] ?? project.category}
        </span>
        <h3>
          <Link to={`/${locale}/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <ul className="tech-chips">
          {project.tech.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        <Link className="read-more" to={`/${locale}/projects/${project.slug}`}>
          {page.readMore} →
        </Link>
      </div>
    </article>
  );
}

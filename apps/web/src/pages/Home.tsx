import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";
import { api, type ProjectSummaryDto } from "../api/client";
import type { GithubRepo } from "@kelianc/shared";
import ProjectCard from "../components/ProjectCard";
import SkillList from "../components/SkillList";
import LogoRibbon from "../components/LogoRibbon";
import CvButton from "../components/CvButton";

export default function Home() {
  const { locale, t, settings } = useContent();
  const hero = t<Record<string, string>>("home.hero");
  const sections = t<Record<string, string>>("home.sections");
  const [featured, setFeatured] = useState<ProjectSummaryDto[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  useEffect(() => {
    api.projects(locale)
      .then((r) => setFeatured(r.projects.filter((p) => p.featured).slice(0, 3)))
      .catch(() => {});
    api.githubRepos()
      .then((r) => setRepos(r.repos.slice(0, 6)))
      .catch(() => {});
  }, [locale]);

  return (
    <div className="page">
      <section className="hero">
        <p className="hero-greeting">{hero.greeting}</p>
        <h1>{hero.name}</h1>
        <p className="hero-role">{hero.role}</p>
        <p className="hero-pitch">{hero.pitch}</p>
        <div className="hero-ctas">
          <Link className="button button-primary" to={`/${locale}/projects`}>
            {hero.ctaProjects}
          </Link>
          <Link className="button button-ghost" to={`/${locale}/contact`}>
            {hero.ctaContact}
          </Link>
        </div>
        <div className="hero-cv">
          <CvButton />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{sections.featuredTitle}</h2>
        <p className="section-subtitle">{sections.featuredSubtitle}</p>
        <div className="project-grid">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p>
          <Link className="read-more" to={`/${locale}/projects`}>
            {sections.viewAllProjects} →
          </Link>
        </p>
      </section>

      <SkillList />

      <section className="section">
        <h2 className="section-title">{sections.githubTitle}</h2>
        <p className="section-subtitle">{sections.githubSubtitle}</p>
        <ul className="repo-list">
          {repos.map((r) => (
            <li key={r.fullName}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <strong>{r.name}</strong>
              </a>
              {r.description && <span className="muted"> — {r.description}</span>}
              <span className="repo-meta">
                {r.language ? ` ${r.language}` : ""}
                {r.stars > 0 ? ` ★ ${r.stars}` : ""}
              </span>
            </li>
          ))}
        </ul>
        {settings && (
          <p>
            <a className="read-more" href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
              @{settings.githubUsername} →
            </a>
          </p>
        )}
      </section>

      <LogoRibbon />
    </div>
  );
}

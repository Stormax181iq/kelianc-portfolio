import { useContent } from "../i18n/ContentContext";

interface SkillItem {
  name: string;
  level: "learning" | "intermediate" | "solid" | "advanced";
  levelLabel: string;
}

export default function SkillList() {
  const { t } = useContent();
  const sections = t<Record<string, string>>("home.sections");
  const skills = t<SkillItem[]>("skills");
  return (
    <section className="skills">
      <h2 className="section-title">{sections.skillsTitle}</h2>
      <p className="section-subtitle">{sections.skillsSubtitle}</p>
      <ul className="skill-list">
        {Array.isArray(skills) && skills.map((s) => (
          <li key={s.name} className="skill-item">
            <span className="skill-name">{s.name}</span>
            <span className={`skill-level skill-level-${s.level}`} data-level={s.level}>
              {s.levelLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

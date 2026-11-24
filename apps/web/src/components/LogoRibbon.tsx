import { useContent } from "../i18n/ContentContext";

const LOGOS = ["PEL", "Decathlon", "Enedis", "IUT Montpellier-Sète"];

export default function LogoRibbon() {
  const { t } = useContent();
  const sections = t<Record<string, string>>("home.sections");
  return (
    <section className="ribbon" aria-label={sections.ribbonTitle}>
      <h2 className="section-title">{sections.ribbonTitle}</h2>
      <ul className="ribbon-list">
        {LOGOS.map((logo) => (
          <li key={logo} className="ribbon-logo">
            {logo}
          </li>
        ))}
      </ul>
    </section>
  );
}

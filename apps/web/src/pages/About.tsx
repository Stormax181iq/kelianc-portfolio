import { useContent } from "../i18n/ContentContext";
import Timeline from "../components/Timeline";
import CvButton from "../components/CvButton";

interface LanguageItem {
  name: string;
  level: string;
}

export default function About() {
  const { t } = useContent();
  const page = t<{
    title: string;
    lead: string;
    paragraphs: string[];
    visionTitle: string;
    vision: string[];
    languagesTitle: string;
    languages: LanguageItem[];
    downloadCv: string;
  }>("about.page");
  return (
    <div className="page narrow">
      <h1>{page.title}</h1>
      <p className="lead">{page.lead}</p>
      {page.paragraphs?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <h2>{page.visionTitle}</h2>
      {page.vision?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <div className="cv-block">
        <CvButton />
      </div>
      <h2>{page.languagesTitle}</h2>
      <ul className="language-list">
        {page.languages?.map((l) => (
          <li key={l.name}>
            <strong>{l.name}</strong> — {l.level}
          </li>
        ))}
      </ul>
      <h2>Parcours</h2>
      <Timeline />
    </div>
  );
}

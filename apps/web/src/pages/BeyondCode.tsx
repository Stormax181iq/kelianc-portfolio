import { useContent } from "../i18n/ContentContext";

interface BeyondSection {
  id: string;
  title: string;
  text: string;
  media?: string | null;
}

export default function BeyondCode() {
  const { t } = useContent();
  const page = t<{ title: string; intro: string; sections: BeyondSection[] }>("beyond.page");
  return (
    <div className="page">
      <h1>{page.title}</h1>
      <p className="lead">{page.intro}</p>
      <div className="beyond-grid">
        {page.sections?.map((s) => (
          <article key={s.id} className="beyond-card">
            {s.media && <img src={s.media} alt={s.title} loading="lazy" />}
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";

/**
 * Semester 4 "portfolio d'apprentissage" shell. The technical foundation
 * (route, DB storage, admin editor) exists now; the content is written in S4.
 */
export default function LearningPortfolio() {
  const { locale, t, settings } = useContent();
  const page = t<Record<string, string>>("learning.page");
  return (
    <div className="page narrow">
      <h1>{page.title}</h1>
      <p className="lead">{page.intro}</p>
      {!settings?.learningPortfolioPublished && <p className="muted note">{page.s4Note}</p>}
      <p>
        <Link to={`/${locale}/`}>← {page.backHome}</Link>
      </p>
    </div>
  );
}

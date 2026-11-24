import { Link } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";

export default function NotFound() {
  const { locale, t } = useContent();
  const errors = t<Record<string, string>>("errors");
  return (
    <div className="page narrow">
      <h1>{errors.notFoundTitle}</h1>
      <p>{errors.notFoundText}</p>
      <p>
        <Link to={`/${locale}/`}>← {errors.backHome}</Link>
      </p>
    </div>
  );
}

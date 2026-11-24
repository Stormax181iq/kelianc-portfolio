import { useContent } from "../i18n/ContentContext";

/** Shown only when a redacted CV PDF has been published via the admin settings. */
export default function CvButton() {
  const { locale, settings, t } = useContent();
  const sections = t<Record<string, string>>("home.sections");
  const cv = locale === "fr" ? settings?.cvFr : settings?.cvEn;
  if (!cv) return <p className="muted">{sections.cvUnavailable}</p>;
  return (
    <a className="button button-primary" href={cv} download>
      {sections.cvDownload}
    </a>
  );
}

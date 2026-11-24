import { useContent } from "../i18n/ContentContext";

export default function Footer() {
  const { t, settings } = useContent();
  const footer = t<Record<string, string>>("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>{footer.rights?.replace("{year}", String(year))}</p>
        <p className="muted">{footer.madeWith}</p>
        <div className="socials">
          {settings && (
            <>
              <a className="chip" href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="chip" href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </>
          )}
        </div>
        <p className="muted terminal-hint">{footer.terminalHint}</p>
      </div>
    </footer>
  );
}

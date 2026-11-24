import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContent } from "../i18n/ContentContext";
import { useTheme } from "../theme/ThemeContext";
import { swapLocaleInPath } from "../i18n/localePath";
import type { Locale } from "@kelianc/shared";

export default function Nav() {
  const { t, locale } = useContent();
  const nav = t<Record<string, string>>("nav");
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const otherLocale: Locale = locale === "en" ? "fr" : "en";

  const links: Array<[string, string]> = [
    [nav.home ?? "Home", ""],
    [nav.about ?? "About", "about"],
    [nav.projects ?? "Projects", "projects"],
    [nav.beyond ?? "Beyond code", "beyond"],
    [nav.learning ?? "Learning portfolio", "learning"],
    [nav.contact ?? "Contact", "contact"],
  ];

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link to={`/${locale}/`} className="brand" onClick={() => setOpen(false)}>
          Kélian Chalier
        </Link>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? nav.closeMenu : nav.openMenu}
        </button>
        <nav id="nav-links" className={open ? "open" : ""} aria-label="Main">
          <ul>
            {links.map(([label, path]) => (
              <li key={path}>
                <NavLink
                  to={`/${locale}/${path}`}
                  end={path === ""}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link className="chip" to={swapLocaleInPath(location.pathname, otherLocale)} lang={otherLocale}>
              {nav.switchLanguage}
            </Link>
            <button className="chip" onClick={toggle} aria-label={nav.toggleTheme}>
              {theme === "light" ? "◐" : "☾"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

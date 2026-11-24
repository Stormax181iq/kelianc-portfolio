import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { Locale } from "@kelianc/shared";
import { LOCALES } from "@kelianc/shared";
import { ContentProvider } from "../i18n/ContentContext";
import { ThemeProvider } from "../theme/ThemeContext";
import Nav from "./Nav";
import { useContent } from "../i18n/ContentContext";
import Footer from "./Footer";
import TerminalEgg from "./TerminalEgg";

/** Injects hreflang alternate links so /en/... and /fr/... reference each other (SEO). */
function HreflangLinks({ locale }: { locale: Locale }) {
  const location = useLocation();
  useEffect(() => {
    const rest = location.pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
    const links = LOCALES.map((l) => {
      const el = document.createElement("link");
      el.rel = "alternate";
      el.setAttribute("hreflang", l);
      el.href = `https://kelianc.eu/${l}${rest === "/" ? "" : rest}${location.search}`;
      el.dataset.hreflang = "1";
      return el;
    });
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `https://kelianc.eu/${locale}${rest === "/" ? "" : rest}`;
    canonical.dataset.hreflang = "1";
    document.head.append(...links, canonical);
    return () => {
      document.head.querySelectorAll("[data-hreflang]").forEach((el) => el.remove());
    };
  }, [locale, location.pathname, location.search]);
  return null;
}

function SkipLink() {
  const { t } = useContent();
  const nav = t<Record<string, string>>("nav");
  return (
    <a className="skip-link" href="#main">
      {nav.skipToContent}
    </a>
  );
}

export default function LocaleLayout({ locale }: { locale: Locale }) {
  return (
    <ThemeProvider>
      <ContentProvider locale={locale}>
        <HreflangLinks locale={locale} />
        <SkipLink />
        <Nav />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
        <TerminalEgg />
      </ContentProvider>
    </ThemeProvider>
  );
}

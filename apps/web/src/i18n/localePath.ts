import { DEFAULT_LOCALE, type Locale } from "@kelianc/shared";

/** Swap the locale prefix of a path: /en/about -> /fr/about, /fr -> /en. */
export function swapLocaleInPath(path: string, target: Locale): string {
  const stripped = path.replace(/^\/(en|fr)(?=\/|$)/, "");
  return `/${target}${stripped === "" ? "/" : stripped}`;
}

export function localeOfPath(path: string): Locale {
  const m = /^\/(en|fr)(?=\/|$)/.exec(path);
  return m ? (m[1] as Locale) : DEFAULT_LOCALE;
}

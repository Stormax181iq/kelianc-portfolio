export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Strip a leading /en or /fr prefix from a path, returning the rest and the locale if present. */
export function splitLocalePrefix(path: string): { locale: Locale | null; rest: string } {
  const match = /^\/(en|fr)(\/.*)?$/.exec(path);
  if (!match) return { locale: null, rest: path };
  return { locale: match[1] as Locale, rest: match[2] ?? "/" };
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale, PublicSettings } from "@kelianc/shared";
import { api, type ContentResponse } from "../api/client";

interface ContentContextValue {
  locale: Locale;
  /** t("nav") -> the localized value of the "nav" content block. */
  t: <T = Record<string, unknown>>(key: string) => T;
  raw: Record<string, unknown>;
  settings: PublicSettings | null;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [data, setData] = useState<ContentResponse | null>(null);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([api.content(locale), api.settings()])
      .then(([content, s]) => {
        if (cancelled) return;
        setData(content);
        setSettings(s);
        document.documentElement.lang = locale;
        const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        const desc = (content.content.meta as { description?: string } | undefined)?.description;
        if (meta && desc) meta.setAttribute("content", desc);
        const title = (content.content.meta as { title?: string } | undefined)?.title;
        if (title) document.title = title;
      })
      .catch((err: Error) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const value = useMemo<ContentContextValue>(
    () => ({
      locale,
      raw: data?.content ?? {},
      t: <T = Record<string, unknown>,>(key: string): T => (data?.content[key] ?? {}) as T,
      settings,
      loading,
      error,
    }),
    [data, locale, settings, loading, error],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './content/en.json';
import fr from './content/fr.json';

export type Content = typeof en;
export type Lang = 'en' | 'fr';

// fr.json must have exactly the same shape as en.json (also checked by scripts/check-content.mjs).
const contents: Record<Lang, Content> = { en, fr: fr satisfies Content };
const STORAGE_KEY = 'portfolio-lang';

function readStoredLang(): Lang | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'en' || v === 'fr' ? v : null;
  } catch {
    return null;
  }
}

function storeLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage unavailable (private mode, blocked cookies): the choice just isn't remembered.
  }
}

function initialLang(): Lang {
  // The page's own <html lang> (en at /, fr at /fr/) is the default; a stored choice wins.
  const pageLang: Lang = document.documentElement.lang === 'fr' ? 'fr' : 'en';
  return readStoredLang() ?? pageLang;
}

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value);
}

function applyDocumentMeta(t: Content) {
  document.documentElement.lang = t.meta.lang;
  document.title = t.meta.title;
  setMeta('meta[name="description"]', t.meta.description);
  setMeta('meta[property="og:title"]', t.meta.title);
  setMeta('meta[property="og:description"]', t.meta.description);
  setMeta('meta[property="og:locale"]', t.meta.locale);
  setMeta('meta[name="twitter:title"]', t.meta.title);
  setMeta('meta[name="twitter:description"]', t.meta.description);
}

type I18n = { lang: Lang; t: Content; toggle: () => void };
const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = contents[lang];

  useEffect(() => applyDocumentMeta(t), [t]);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'fr' : 'en';
      storeLang(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ lang, t, toggle }), [lang, t, toggle]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

/** Replaces {placeholders} in a content string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? '');
}

// Site root, derived from this module's URL (src/ in dev, assets/ in the build), so asset
// paths resolve the same from / and from /fr/, under any GitHub Pages sub-path.
const SITE_ROOT = new URL(/* @vite-ignore */ '../', import.meta.url);

/** Resolves a path from public/ to an absolute URL. */
export function asset(path: string): string {
  return new URL(path, SITE_ROOT).href;
}

import { DEFAULT_LANG, SUPPORTED_LANGS, type Language } from './config';
import de from './translations/de.json';
import en from './translations/en.json';

const translations = { de, en } as const;

export type Translations = typeof de;

export function isValidLang(lang: string | undefined): lang is Language {
  return SUPPORTED_LANGS.includes(lang as Language);
}

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  return isValidLang(lang) ? lang : DEFAULT_LANG;
}

export function getLocalizedPath(path: string, lang: Language): string {
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}

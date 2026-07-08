import type { Language } from './config';
import de from './translations/de.json';
import en from './translations/en.json';

const translations = { de, en } as const;

export type Translations = typeof de;

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

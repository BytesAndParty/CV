export const LANGUAGES = {
  de: { name: 'Deutsch', flag: '🇩🇪' },
  en: { name: 'English', flag: '🇬🇧' },
} as const;

export type Language = keyof typeof LANGUAGES;

export const DEFAULT_LANG: Language = 'de';

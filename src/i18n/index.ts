import en from "./en";
import my from "./my";
import lo from "./lo";
import type { Language, Translations } from "./types";

export const LANGUAGES: Language[] = ["en", "my", "lo"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  my: "မြန်မာ",
  lo: "ລາວ",
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  my: "Burmese",
  lo: "Lao",
};

export const translations: Record<Language, Translations> = { en, my, lo };

export function t(lang: Language): Translations {
  return translations[lang] ?? translations.en;
}

export function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "my" || value === "lo";
}

export type { Language, Translations };

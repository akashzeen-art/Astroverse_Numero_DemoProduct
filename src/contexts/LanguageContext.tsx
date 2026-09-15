import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { t, isLanguage } from "@/i18n";
import type { Language, Translations } from "@/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return isLanguage(saved) ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem("app_language", lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };

  const tr = t(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

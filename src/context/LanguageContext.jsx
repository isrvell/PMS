import { createContext, useContext, useState, useCallback } from "react";
import en from "../i18n/en.js";
import fr from "../i18n/fr.js";

const translations = { en, fr };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] || translations.en[key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

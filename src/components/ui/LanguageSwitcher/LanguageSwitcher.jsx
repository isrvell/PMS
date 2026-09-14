import { useLanguage } from "../../../context/LanguageContext.jsx";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { lang, switchLang } = useLanguage();

  return (
    <button
      className="lang-switcher"
      onClick={() => switchLang(lang === "en" ? "fr" : "en")}
      title={lang === "en" ? "Passer en français" : "Switch to English"}
    >
      {lang === "en" ? "FR" : "EN"}
    </button>
  );
}

export default LanguageSwitcher;

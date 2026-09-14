import "./WelcomeSection.css";
import { useLanguage } from "../../../context/LanguageContext.jsx";

function WelcomeSection({ name, taskDueToday, upcomingDeadlines }) {
  const { t, lang } = useLanguage();

  const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("goodMorning") : hour < 18 ? t("goodAfternoon") : t("goodEvening");

  return (
    <section className="welcome-section">
      <span className="welcome-date">{today}</span>
      <h1 className="welcome-title">
        {greeting} {name}
      </h1>
      <div className="welcome-stats">
        <div className="welcome-stat">
          <span className="welcome-stat-value">{taskDueToday}</span>
          <span className="welcome-stat-label">{t("dueToday")}</span>
        </div>
        <div className="welcome-divider"></div>
        <div className="welcome-stat">
          <span className="welcome-stat-value">{upcomingDeadlines}</span>
          <span className="welcome-stat-label">{t("upcomingDeadlines")}</span>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;

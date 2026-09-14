import Priority from "../../../../components/ui/Priority/Priority";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import "./Deadlines.css";

function Deadlines({ deadlines }) {
  const { t } = useLanguage();
  return (
    <section className="dash-card">
      <h3 className="dash-card-title">{t("upcomingDeadlinesTitle")}</h3>
      {(!deadlines || deadlines.length === 0) ? (
        <p className="dash-empty">{t("noUpcomingDeadlines")}</p>
      ) : (
        <div className="deadline-list">
          {deadlines.slice(0, 4).map((d) => (
            <div key={d.id} className="deadline-row">
              <div className="deadline-date-block">
                <span className="deadline-day">{d.day}</span>
                <span className="deadline-month">{d.month}</span>
              </div>
              <div className="deadline-info">
                <span className="deadline-name">{d.title}</span>
                <span className="deadline-project">{d.project}</span>
              </div>
              <Priority level={d.priority} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Deadlines;

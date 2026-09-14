import Priority from "../../../../components/ui/Priority/Priority";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import "./ActionRequired.css";

function ActionRequired({ actions }) {
  const { t } = useLanguage();
  return (
    <section className="dash-card">
      <h3 className="dash-card-title">{t("actionRequired")}</h3>
      {(!actions || actions.length === 0) ? (
        <p className="dash-empty">{t("nothingNeedsAttention")}</p>
      ) : (
        <div className="action-list">
          {actions.slice(0, 4).map((a) => (
            <div key={a.id} className="action-row">
              <div className="action-info">
                <span className="action-name">{a.title}</span>
                <span className="action-due">{t("due")} {a.dueDate}</span>
              </div>
              <Priority level={a.priority} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ActionRequired;

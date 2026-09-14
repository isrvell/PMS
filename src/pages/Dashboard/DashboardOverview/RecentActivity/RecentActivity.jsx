import Avatar from "../../../../components/ui/Avatar/Avatar";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import "./RecentActivity.css";

function RecentActivity({ activities }) {
  const { t } = useLanguage();
  return (
    <section className="dash-card">
      <h3 className="dash-card-title">{t("recentActivity")}</h3>
      {(!activities || activities.length === 0) ? (
        <p className="dash-empty">{t("noRecentActivity")}</p>
      ) : (
        <div className="activity-list">
          {activities.slice(0, 5).map((a) => (
            <div key={a.id} className="activity-row">
              <Avatar size={32} src={a.userImage} name={a.userName} />
              <div className="activity-body">
                <span className="activity-text">
                  <strong>{a.userName}</strong> {a.action}
                </span>
                <span className="activity-time">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;

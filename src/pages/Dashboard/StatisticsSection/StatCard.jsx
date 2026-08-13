import "./StatCard.css";
function StatCard({ title, value, icon }) {
  return (
    <article className="stat-card text-center d-flex flex-column align-items-center shadow-sm rounded-3 p-3 gap-3">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-card-content d-flex flex-column gap-2">
        <span className="stat-card-value">{value}</span>
        <p className="stat-card-title">{title}</p>
      </div>
    </article>
  );
}

export default StatCard;

import "./EmptyState.css";

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon-wrapper">
        <i className={`bi ${icon}`}></i>
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button className="btn empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

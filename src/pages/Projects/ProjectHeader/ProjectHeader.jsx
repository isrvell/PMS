import "./ProjectHeader.css";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";

export default function ProjectHeader({ onAddProject, onToggleFilters }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === "admin";

  return (
    <div className="project-header d-flex justify-content-between align-items-center">
      <h1 className="mb-0">{t("projects")}</h1>
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn filter-btn"
          aria-label="Filter projects"
          onClick={onToggleFilters}
        >
          <i className="bi bi-sliders"></i>
        </button>
        {isAdmin && (
          <button className="btn add-project-btn" onClick={onAddProject}>
            <i className="bi bi-plus-lg me-2"></i>{t("addProject")}
          </button>
        )}
      </div>
    </div>
  );
}

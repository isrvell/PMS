import "./ProjectFilters.css";
import { useLanguage } from "../../../context/LanguageContext.jsx";

function ProjectFilters({ activeFilter, onFilterChange }) {
  const { t } = useLanguage();

  const filters = [
    { id: "all", label: t("all") },
    { id: "completed", label: t("completed") },
    { id: "active", label: t("active") },
    { id: "in-hold", label: t("inHold") },
  ];

  return (
    <nav className="project-filters" aria-label="Project filters">
      <div className="d-flex gap-4">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={`filter-item ${activeFilter === filter.id ? "active" : ""}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default ProjectFilters;

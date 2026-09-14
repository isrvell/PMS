import { useLanguage } from "../../../context/LanguageContext.jsx";

function TeamFilters({ activeFilter, onFilterChange }) {
  const { t } = useLanguage();

  const filters = [
    { id: "all", label: t("all") },
    { id: "frontend", label: t("frontend") },
    { id: "backend", label: t("backend") },
    { id: "design", label: t("design") },
  ];

  return (
    <nav className="team-filters" aria-label="Team filters">
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

export default TeamFilters;

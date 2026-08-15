import "./ProjectFilters.css";
const filters = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "completed",
    label: "Completed",
  },
  {
    id: "active",
    label: "Active",
  },
  {
    id: "in-hold",
    label: "In Hold",
  },
];
function ProjectFilters({ activeFilter, onFilterChange }) {
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

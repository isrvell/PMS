const filters = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "frontend",
    label: "Frontend",
  },
  {
    id: "backend",
    label: "Backend",
  },
  {
    id: "design",
    label: "Design",
  },
];

function TeamFilters({ activeFilter, onFilterChange }) {
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

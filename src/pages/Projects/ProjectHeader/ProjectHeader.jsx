import "./ProjectHeader.css";
export default function ProjectHeader() {
  return (
    <div className="project-header d-flex justify-content-between align-items-center">
      <h1 className="mb-0">Projects</h1>
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn filter-btn"
          aria-label="Filter-projects"
        >
          <i className="bi bi-sliders"></i>
        </button>
        <button className="btn add-project-btn">
          <i className="bi bi-plus-lg me-2"></i>Add Project
        </button>
      </div>
    </div>
  );
}

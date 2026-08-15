import "./ProjectCard.css";
import { projectStatuses } from "../../../data/projectsData";
function ProjectCard({ name, description, date, status, progress, members }) {
  const projectStatus = projectStatuses[status];
  return (
    <article
      className="project-card shadow-sm rounded-3 h-100"
      style={{ "--status-color": projectStatus.color }}
    >
      {/* Project Information */}
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h5 className="project-name">{name}</h5>
            <p className="project-description mb-2">{description}</p>
          </div>
        </div>
        <p className="project-date mb-3">
          <i className="bi bi-calendar3 me-2"></i>
          {date}
        </p>
        {/* Status + Progress */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="project-status">{projectStatus.label}</span>
          <span className="project-progress">{progress}%</span>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      {/* Members */}
      <div className="project-members border-top px-3 py-3">
        <i className="bi bi-people me-2"></i>
        {members} Members
      </div>
    </article>
  );
}

export default ProjectCard;

import "./TeamHeader.css";
function TeamHeader() {
  return (
    <header className="team-header d-flex justify-content-between align-items-center mb-4">
      <h1 className="mb-0">Team</h1>
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn team-filter-btn"
          aria-label="Filter team members"
        >
          <i className="bi bi-sliders"></i>
        </button>
        <button type="button" className="btn invit-btn">
          <i className="bi bi-person-plus me-2"></i>
          Invite Member
        </button>
      </div>
    </header>
  );
}

export default TeamHeader;

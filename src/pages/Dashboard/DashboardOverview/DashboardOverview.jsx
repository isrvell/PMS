import RecentActivity from "./RecentActivity/RecentActivity.jsx";
import Deadlines from "./Deadlines/Deadlines.jsx";
import ActionRequired from "./ActionRequired/ActionRequired.jsx";
import ProjectProgress from "./ProjectProgress/ProjectProgress.jsx";

function DashboardOverview({
  recentActivities,
  deadlines,
  actions,
  projectProgress,
}) {
  return (
    <section className="dashboard-overview">
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="row g-4 ">
            <div className="col-12 col-lg-6 ">
              <RecentActivity activities={recentActivities} />
            </div>
            <div className="col-12 col-lg-6">
              <Deadlines deadlines={deadlines} />
            </div>
            <div className="col-lg-12">
              <ActionRequired actions={actions} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <ProjectProgress data={projectProgress} />
        </div>
      </div>
    </section>
  );
}

export default DashboardOverview;

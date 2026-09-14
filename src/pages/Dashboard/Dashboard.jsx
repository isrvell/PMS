import WelcomeSection from "./WelcomeSection/WelcomeSection.jsx";
import StatisticsSection from "./StatisticsSection/StatisticsSection.jsx";
import DashboardOverview from "./DashboardOverview/DashboardOverview.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getDashboardData } from "../../services/dashboardService.js";
import useApi from "../../hooks/useApi.js";

function Dashboard() {
  const { workspaceId } = useWorkspace();
  const { data, loading, error } = useApi(
    () => getDashboardData(workspaceId),
    [workspaceId]
  );

  if (loading) {
    return (
      <main className="dashboard d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border" style={{ color: "var(--color-text-muted)", width: "2rem", height: "2rem" }} role="status"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard p-4">
        <div className="alert alert-danger">{error}</div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <WelcomeSection
        greeting={data.welcome.greeting}
        name={data.welcome.name}
        taskDueToday={data.welcome.taskDueToday}
        upcomingDeadlines={data.welcome.upcomingDeadlines}
      />
      <StatisticsSection stats={data.stats} />
      <DashboardOverview
        recentActivities={data.recentActivities}
        deadlines={data.deadlines}
        actions={data.actions}
        projectProgress={data.projectProgress}
      />
    </main>
  );
}

export default Dashboard;

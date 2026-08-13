import WelcomeSection from "./WelcomeSection/WelcomeSection.jsx";
import { welcomeData } from "../../data/welcomeData.js";

import StatisticsSection from "./StatisticsSection/StatisticsSection.jsx";

import DashboardOverview from "./DashboardOverview/DashboardOverview.jsx";
import { actionRequiredData } from "../../data/actionRequiredData.js";
import { deadlinesData } from "../../data/deadlinesData.js";
import { recentActivityData } from "../../data/recentActivityData.js";
import { projectProgressData } from "../../data/projectProgressData.js";

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="d-flex flex-column gap-4">
        <WelcomeSection {...welcomeData} />
        <StatisticsSection />
        <DashboardOverview
          recentActivities={recentActivityData}
          deadlines={deadlinesData}
          actions={actionRequiredData}
          projectProgress={projectProgressData}
        />
      </div>
    </main>
  );
}

export default Dashboard;

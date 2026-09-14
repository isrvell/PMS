import { useState, useEffect, useCallback } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getProjects } from "../../services/projectService.js";
import { getVelocityReport, getCreatedVsResolvedReport } from "../../services/reportService.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import "./Reports.css";

function Reports() {
  const { workspaceId } = useWorkspace();
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [velocityData, setVelocityData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const projList = await getProjects(workspaceId);
      setProjects(projList);
      const projId = selectedProjectId || projList[0]?.id || "";
      if (!selectedProjectId && projList[0]?.id) {
        setSelectedProjectId(projList[0].id);
      }

      const [vel, sum] = await Promise.all([
        getVelocityReport(workspaceId, projId),
        getCreatedVsResolvedReport(workspaceId),
      ]);
      setVelocityData(vel);
      setSummaryData(sum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare Nivo bar chart data
  const barData = velocityData.map((v) => ({
    sprint: v.sprintName,
    "Total Scope": v.totalTasks,
    Completed: v.completedTasks,
    "Total Points": v.totalPoints,
    "Completed Points": v.completedPoints,
  }));

  // Prepare Nivo pie chart data for issue types
  const pieData = summaryData
    ? [
        { id: "Tasks", value: summaryData.byType.task, color: "#3b82f6" },
        { id: "Stories", value: summaryData.byType.story, color: "#22c55e" },
        { id: "Bugs", value: summaryData.byType.bug, color: "#ef4444" },
        { id: "Epics", value: summaryData.byType.epic, color: "#9333ea" },
      ].filter((d) => d.value > 0)
    : [];

  // Prepare status distribution for a secondary pie
  const statusPieData = summaryData
    ? [
        { id: "To Do", value: summaryData.byStatus.todo, color: "#94a3b8" },
        { id: "In Progress", value: summaryData.byStatus.inProgress, color: "#3b82f6" },
        { id: "Review", value: summaryData.byStatus.review, color: "#f59e0b" },
        { id: "Done", value: summaryData.byStatus.done, color: "#22c55e" },
      ].filter((d) => d.value > 0)
    : [];

  const completionRate = summaryData && summaryData.total > 0
    ? Math.round((summaryData.resolved / summaryData.total) * 100)
    : 0;

  return (
    <div className="reports-page">
      <header className="reports-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="reports-title">{t("reportsTitle")}</h2>
          <p className="text-muted mb-0">{t("reportsSubtitle")}</p>
        </div>
        <div>
          <select
            className="form-select form-select-sm shadow-sm"
            style={{ width: 220 }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {/* ── Velocity Bar Chart ── */}
          <div className="col-12">
            <div className="report-card shadow-sm">
              <h4 className="report-card-title">{t("sprintVelocity")}</h4>
              <p className="text-muted small mb-0">{t("sprintVelocityDesc")}</p>

              {barData.length === 0 ? (
                <div className="report-empty">
                  <i className="bi bi-bar-chart-line"></i>
                  <p>{t("noSprintHistory")}</p>
                </div>
              ) : (
                <div style={{ height: 340 }}>
                  <ResponsiveBar
                    data={barData}
                    keys={["Total Scope", "Completed"]}
                    indexBy="sprint"
                    margin={{ top: 20, right: 130, bottom: 60, left: 50 }}
                    padding={0.35}
                    groupMode="grouped"
                    colors={["#cbd5e1", "#22c55e"]}
                    borderRadius={4}
                    axisBottom={{
                      tickSize: 0,
                      tickPadding: 8,
                      tickRotation: barData.length > 6 ? -30 : 0,
                    }}
                    axisLeft={{
                      tickSize: 0,
                      tickPadding: 8,
                    }}
                    enableGridY={true}
                    gridYValues={5}
                    enableLabel={true}
                    labelSkipWidth={20}
                    labelSkipHeight={16}
                    labelTextColor="#fff"
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        translateX: 120,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        symbolSize: 12,
                        symbolShape: "circle",
                      },
                    ]}
                    theme={{
                      text: { fill: "var(--color-text-muted)" },
                      axis: { ticks: { text: { fill: "var(--color-text-muted)", fontSize: 12 } } },
                      grid: { line: { stroke: "var(--color-border)", strokeDasharray: "4 4" } },
                    }}
                    tooltip={({ id, value, indexValue }) => (
                      <div className="report-tooltip">
                        <strong>{indexValue}</strong>
                        <br />
                        {id}: {value}
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Issue Type Distribution (Pie) ── */}
          <div className="col-12 col-lg-6">
            <div className="report-card shadow-sm">
              <h4 className="report-card-title">{t("issueTypes")}</h4>
              <p className="text-muted small mb-0">{t("distributionByType")}</p>

              {pieData.length === 0 ? (
                <div className="report-empty">
                  <i className="bi bi-pie-chart"></i>
                  <p>{t("noIssuesToDisplay")}</p>
                </div>
              ) : (
                <div style={{ height: 300 }}>
                  <ResponsivePie
                    data={pieData}
                    margin={{ top: 20, right: 100, bottom: 20, left: 20 }}
                    innerRadius={0.55}
                    padAngle={2}
                    cornerRadius={4}
                    activeOuterRadiusOffset={6}
                    colors={{ datum: "data.color" }}
                    borderWidth={0}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={20}
                    arcLabelsTextColor="#fff"
                    legends={[
                      {
                        anchor: "right",
                        direction: "column",
                        translateX: 80,
                        translateY: 0,
                        itemWidth: 80,
                        itemHeight: 24,
                        symbolSize: 12,
                        symbolShape: "circle",
                      },
                    ]}
                    theme={{
                      text: { fill: "var(--color-text-muted)" },
                    }}
                    tooltip={({ datum }) => (
                      <div className="report-tooltip">
                        <strong>{datum.id}</strong>: {datum.value} issues
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Status Distribution (Pie) ── */}
          <div className="col-12 col-lg-6">
            <div className="report-card shadow-sm">
              <h4 className="report-card-title">{t("statusBreakdown")}</h4>
              <p className="text-muted small mb-0">
                Completion rate: <strong>{completionRate}%</strong>
                ({summaryData?.resolved || 0}/{summaryData?.total || 0} done)
              </p>

              {statusPieData.length === 0 ? (
                <div className="report-empty">
                  <i className="bi bi-pie-chart"></i>
                  <p>{t("noStatusData")}</p>
                </div>
              ) : (
                <div style={{ height: 300 }}>
                  <ResponsivePie
                    data={statusPieData}
                    margin={{ top: 20, right: 100, bottom: 20, left: 20 }}
                    innerRadius={0.55}
                    padAngle={2}
                    cornerRadius={4}
                    activeOuterRadiusOffset={6}
                    colors={{ datum: "data.color" }}
                    borderWidth={0}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={20}
                    arcLabelsTextColor="#fff"
                    legends={[
                      {
                        anchor: "right",
                        direction: "column",
                        translateX: 80,
                        translateY: 0,
                        itemWidth: 80,
                        itemHeight: 24,
                        symbolSize: 12,
                        symbolShape: "circle",
                      },
                    ]}
                    theme={{
                      text: { fill: "var(--color-text-muted)" },
                    }}
                    tooltip={({ datum }) => (
                      <div className="report-tooltip">
                        <strong>{datum.id}</strong>: {datum.value} issues
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Summary Stats Cards ── */}
          {summaryData && (
            <div className="col-12">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="report-stat-card shadow-sm">
                    <div className="report-stat-value">{summaryData.total}</div>
                    <div className="report-stat-label">{t("totalIssues")}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="report-stat-card shadow-sm">
                    <div className="report-stat-value" style={{ color: "#22c55e" }}>{summaryData.resolved}</div>
                    <div className="report-stat-label">{t("resolved")}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="report-stat-card shadow-sm">
                    <div className="report-stat-value" style={{ color: "#f59e0b" }}>{summaryData.open}</div>
                    <div className="report-stat-label">{t("open")}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="report-stat-card shadow-sm">
                    <div className="report-stat-value" style={{ color: "#3b82f6" }}>{completionRate}%</div>
                    <div className="report-stat-label">{t("completionRate")}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;

import "./ProjectProgress.css";
import { ResponsivePie } from "@nivo/pie";
function ProjectProgress({ data }) {
  return (
    <section className="project-progress shadow-sm rounded-3 p-3 h-100">
      <div className="project-progress-title d-flex gap-2">
        <i className="bi bi-graph-up-arrow"></i>
        <h4 className="mb-4">Project Progress</h4>
      </div>
      <div className="project-progress-chart">
        <ResponsivePie
          data={data}
          innerRadius={0.6}
          padAngle={1}
          cornerRadius={4}
          colors={{ datum: "data.color" }}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          activeOuterRadiusOffset={8}
          animate={true}
          motionConfig="gentle"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          // Tooltip
          tooltip={({ datum }) => (
            <div className="chart-tooltip">
              <strong>{datum.id}</strong>
              <span>{datum.value}%</span>
            </div>
          )}
        />
      </div>
      <div className="project-progress-legend">
        {data.map((item) => (
          <div className="project-progress-legend-item" key={item.id}>
            <span
              className="legend-dot"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="legend-label">{item.id}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectProgress;

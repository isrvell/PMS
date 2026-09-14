import "./ProjectProgress.css";
import { ResponsivePie } from "@nivo/pie";
import { useLanguage } from "../../../../context/LanguageContext.jsx";

function ProjectProgress({ data }) {
  const { t } = useLanguage();

  const labelMap = {
    "In Progress": t("inProgress"),
    "Completed": t("completed"),
    "Pending": t("pending"),
  };

  return (
    <section className="dash-card progress-card">
      <h3 className="dash-card-title">{t("projectStatus")}</h3>
      <div className="progress-layout">
        <div className="progress-chart-wrapper">
          <ResponsivePie
            data={data}
            innerRadius={0.7}
            padAngle={2}
            cornerRadius={6}
            colors={{ datum: "data.color" }}
            enableArcLinkLabels={false}
            enableArcLabels={false}
            activeOuterRadiusOffset={4}
            animate={true}
            motionConfig="gentle"
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            tooltip={({ datum }) => (
              <div className="chart-tooltip">
                <strong>{labelMap[datum.id] || datum.id}</strong>
                <span>{datum.value}%</span>
              </div>
            )}
          />
        </div>
        <div className="progress-legend">
          {data.map((item) => (
            <div className="progress-legend-item" key={item.id}>
              <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
              <span className="legend-label">{labelMap[item.id] || item.id}</span>
              <span className="legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectProgress;

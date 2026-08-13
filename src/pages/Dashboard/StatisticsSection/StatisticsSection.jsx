import { staticData } from "../../../data/statsData";
import StatCard from "./StatCard.jsx";
function StatisticsSection() {
  return (
    <section className="statidtics-section">
      <div className="row g-5">
        {staticData.map((stat) => (
          <div className="col-12 col-lg-3 col-md-6" key={stat.id}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticsSection;

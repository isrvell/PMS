import StatCard from "./StatCard.jsx";

function StatisticsSection({ stats }) {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
    </section>
  );
}

export default StatisticsSection;

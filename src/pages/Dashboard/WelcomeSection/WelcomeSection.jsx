import "./WelcomeSection.css";

function WelcomeSection({ greeting, name, taskDueToday, upcomingDealines }) {
  return (
    <section className="welcome-section">
      <h1 className="welcome-title">
        {greeting} <span className="user-name">{name}</span>
        <span className="wave">👋</span>
      </h1>
      <p className="welcome-description">
        You have <span className="task-count">{taskDueToday} </span> tasks due
        today and <span className="deadline-count">{upcomingDealines}</span>{" "}
        upcoming deadlines
      </p>
    </section>
  );
}

export default WelcomeSection;

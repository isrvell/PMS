import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import "./StatCard.css";

function StatCard({ title, value, icon }) {
  const { t } = useLanguage();
  const titleMap = {
    "Active Projects": t("activeProjects"),
    "Total Tasks": t("totalTasks"),
    "Completed Tasks": t("completedTasks"),
    "Upcoming Deadlines": t("upcomingDeadlinesTitle"),
  };
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current || typeof value !== "number") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 600;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stat-card">
      <span className="stat-card-value">{display}</span>
      <span className="stat-card-title">{titleMap[title] || title}</span>
    </div>
  );
}

export default StatCard;

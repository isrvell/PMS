import "./Priority.css";
function Priority({ level }) {
  const priorityLabels = {
    high: "High",
    medium: "Med",
    low: "Low",
  };
  return (
    <span className={`priority priority-${level}`}>
      {priorityLabels[level]}
    </span>
  );
}

export default Priority;

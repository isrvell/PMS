import "./Badge.css";

function Badge({ count }) {
  if (count <= 0) return null;
  return <div className="badge">{count}</div>;
}

export default Badge;

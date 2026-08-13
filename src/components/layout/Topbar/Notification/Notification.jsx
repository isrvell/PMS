import Badge from "../../../ui/Badge/Badge";
import "./Notification.css";

function Notification() {
  return (
    <button className="notification">
      <Badge count={1} />
      <i className="bi bi-bell"></i>
    </button>
  );
}

export default Notification;

import Avatar from "../../../../components/ui/Avatar/Avatar";
import "./RecentActivity.css";
function ActivityItem({ userImage, userName, action, time }) {
  return (
    <article className="activity-item d-flex align-items-center justify-content-between ">
      <div className="d-flex align-items-center gap-3">
        <Avatar size={55} src={userImage} name={userName} />
        <div className="activity-info d-flex flex-column text-left">
          <h6 className="mb-1">{userName}</h6>
          <p className="mb-0">{action}</p>
        </div>
      </div>
      <time className="activity-time">{time}</time>
    </article>
  );
}

export default ActivityItem;

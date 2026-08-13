import ActivityItem from "./ActivityItem";
import { Fragment } from "react";
import { recentActivityData } from "../../../../data/recentActivityData";
function RecentActivity() {
  return (
    <section className="recent-activity shadow-sm rounded-3 p-3 h-100">
      <div className="activity-title d-flex gap-2">
        <i className="bi bi-activity"></i>
        <h4 className="mb-4">Recent Activity</h4>
      </div>
      <div className="activity-list">
        {recentActivityData.slice(0, 2).map((activity, index) => (
          <Fragment key={activity.id}>
            <ActivityItem
              userName={activity.userName}
              userImage={activity.userImage}
              action={activity.action}
              time={activity.time}
            />
            {index < 1 && <div className="divider"></div>}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;

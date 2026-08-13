import DeadlineItem from "./DeadlineItem";
import { deadlinesData } from "../../../../data/deadlinesData";
import { Fragment } from "react";
function Deadlines() {
  return (
    <section className="deadline shadow-sm rounded-3 p-3 h-100">
      <div className="deadline-title d-flex gap-2">
        <i className="bi bi-clock"></i>
        <h4 className="mb-4">Upcoming Deadlines</h4>
      </div>
      <div className="deadline-list">
        {deadlinesData.slice(0, 2).map((deadline, index) => (
          <Fragment key={deadline.id}>
            <DeadlineItem
              day={deadline.day}
              month={deadline.month}
              title={deadline.title}
              project={deadline.project}
              priority={deadline.priority}
            />
            {index < 1 && <div className="divider"></div>}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default Deadlines;

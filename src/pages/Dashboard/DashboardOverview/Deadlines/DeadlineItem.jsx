import "./Deadlines.css";
import Priority from "../../../../components/ui/Priority/Priority";
function DeadlineItem({ day, month, title, project, priority }) {
  return (
    <article className="deadline-item d-flex align-items-center justify-content-between ">
      <div className="d-flex align-item-center gap-3">
        <div className="deadline-date d-flex flex-column align-item-center justify-content-center p-2 text-center">
          <span className=" m-0">{day}</span>
          <small className="d-block">{month}</small>
        </div>
        <div className="deadline-info">
          <h6>{title}</h6>
          <p>{project}</p>
        </div>
      </div>
      <Priority level={priority} />
    </article>
  );
}

export default DeadlineItem;

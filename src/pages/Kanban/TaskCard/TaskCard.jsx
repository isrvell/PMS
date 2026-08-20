import "./TaskCard.css";
import Priority from "../../../components/ui/Priority/Priority.jsx";
import Avatar from "../../../components/ui/Avatar/Avatar.jsx";
import { useSortable } from "@dnd-kit/react/sortable";

function TaskCard({
  id,
  index,
  group,
  title,
  description,
  priority,
  dueDate,
  members,
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    group,
    type: "task",
    accept: "task",
  });
  return (
    <article
      ref={ref}
      className={`task-card ${isDragging ? "dragging" : ""} shadow-sm rounded-3 p-3 bg-white mb-3`}
    >
      <div className="task-card-header d-flex justify-content-between align-items-start gap-3">
        <h5>{title}</h5>
        <Priority level={priority} />
      </div>
      <p className="task-description">{description}</p>
      <div className="task-card-footer d-flex align-items-center justify-content-between gap-2">
        <div className="task-card-member d-flex">
          {members.slice(0, 2).map((member) => (
            <Avatar
              size={25}
              key={member.id}
              src={member.avatar}
              name={member.name}
            />
          ))}
          {members.length > 2 && (
            <div className="avatar avatar-more">+{members.length - 2}</div>
          )}
        </div>
        <span className="task-due-date">
          <i className="bi bi-calendar3 me-2"></i>
          {dueDate}
        </span>
      </div>
    </article>
  );
}

export default TaskCard;

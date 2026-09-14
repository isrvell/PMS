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
  type = "task",
  dueDate,
  members = [],
  onClick,
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    group,
    type: "task",
    accept: "task",
  });

  const getTypeIcon = (t) => {
    switch (t) {
      case "epic": return <i className="bi bi-lightning-fill text-purple me-1" title="Epic" style={{ color: "#9333ea" }}></i>;
      case "story": return <i className="bi bi-bookmark-star-fill text-success me-1" title="Story"></i>;
      case "bug": return <i className="bi bi-bug-fill text-danger me-1" title="Bug"></i>;
      default: return <i className="bi bi-check2-square text-primary me-1" title="Task"></i>;
    }
  };

  return (
    <article
      ref={ref}
      className={`task-card ${isDragging ? "dragging" : ""} shadow-sm rounded-3 p-3 bg-white mb-3`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <div className="task-card-header d-flex justify-content-between align-items-start gap-3">
        <h5 className="d-flex align-items-center">
          {getTypeIcon(type)}
          {title}
        </h5>
        <Priority level={priority} />
      </div>
      <p className="task-description">{description}</p>
      <div className="task-card-footer d-flex align-items-center justify-content-between gap-2">
        <div className="task-card-member d-flex">
          {members.slice(0, 2).map((member) => (
            <Avatar
              size={25}
              key={member._id || member.id}
              src={member.avatar}
              name={member.name}
            />
          ))}
          {members.length > 2 && (
            <div className="avatar avatar-more">+{members.length - 2}</div>
          )}
        </div>
        {dueDate && (
          <span className="task-due-date">
            <i className="bi bi-calendar3 me-2"></i>
            {dueDate}
          </span>
        )}
      </div>
    </article>
  );
}

export default TaskCard;

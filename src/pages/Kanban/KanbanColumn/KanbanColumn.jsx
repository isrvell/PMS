import TaskCard from "../TaskCard/TaskCard";
import "./KanbanColumn.css";
import { useDroppable } from "@dnd-kit/react";
import { useLanguage } from "../../../context/LanguageContext.jsx";

function KanbanColumn({ id, title, tasks, onTaskClick }) {
  const { ref } = useDroppable({ id });
  const { lang } = useLanguage();

  return (
    <section ref={ref} className="kanban-column rounded-3 shadow-sm py-4 px-3 mb-4">
      <header className="kanban-column-header d-flex gap-2 mb-3">
        <h4>{title}</h4>
        <span className="kanban-task-count">{tasks.length}</span>
      </header>
      <div className="kanban-column-content d-flex flex-column">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id || task.id}
            id={task._id || task.id}
            index={index}
            group={id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            type={task.type}
            dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString(lang === "fr" ? "fr" : "en", { month: "short", day: "numeric" }) : ""}
            members={(task.members || []).map((m) =>
              typeof m === "object" ? { id: m._id || m.id, name: m.name, avatar: m.avatar } : m
            )}
            onClick={() => onTaskClick?.(task._id || task.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default KanbanColumn;

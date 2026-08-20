import TaskCard from "../TaskCard/TaskCard";
import "./KanbanColumn.css";
import { useDroppable } from "@dnd-kit/react";
function KanbanColumn({ id, title, tasks }) {
  const { ref } = useDroppable({
    id,
  });
  return (
    <section
      ref={ref}
      className="kanban-column rounded-3 shadow-sm py-4 px-3 mb-4"
    >
      <header className="kanban-column-header d-flex gap-2 mb-3">
        <h4>{title}</h4>
        <span className="kanban-task-count">{tasks.length}</span>
      </header>
      <div className="kanban-column-content d-flex flex-column">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            id={task.id}
            index={index}
            group={id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            dueDate={task.dueDate}
            members={task.members}
          />
        ))}
      </div>
    </section>
  );
}

export default KanbanColumn;

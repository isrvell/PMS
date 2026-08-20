import { kanbanData } from "../../../data/kanbanData";
import KanbanColumn from "../KanbanColumn/KanbanColumn";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import "./KanbanBoard.css";
import { useState } from "react";
import { move } from "@dnd-kit/helpers";
import TaskCard from "../TaskCard/TaskCard";
function KanbanBoard() {
  const [columns, setColumns] = useState(() => ({
    todo: kanbanData.filter((task) => task.status === "todo"),
    "in-progress": kanbanData.filter((task) => task.status === "in-progress"),
    review: kanbanData.filter((task) => task.status === "review"),
    done: kanbanData.filter((task) => task.status === "done"),
  }));
  const [activeTask, setActiveTask] = useState(null);
  const columnsDefinitions = [
    {
      id: "todo",
      title: "To Do",
    },
    {
      id: "in-progress",
      title: "In Progress",
    },
    {
      id: "review",
      title: "Review",
    },
    {
      id: "done",
      title: "Done",
    },
  ];
  const handleDragStart = (event) => {
    const taskId = event.operation.source.id;
    const task = Object.values(columns)
      .flat()
      .find((task) => task.id === taskId);
    setActiveTask(task);
  };
  const handleDragOver = (event) => {
    if (event.canceled) return;
    setColumns((currentColumns) => move(currentColumns, event));
  };
  const handleDragEnd = () => {
    setColumns((currentColumns) => {
      const updatedColumns = { ...currentColumns };

      Object.entries(updatedColumns).forEach(([status, tasks]) => {
        updatedColumns[status] = tasks.map((task) => ({
          ...task,
          status,
        }));
      });

      return updatedColumns;
    });

    setActiveTask(null);
  };
  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-board">
        <div className="row">
          {columnsDefinitions.map((column) => (
            <div key={column.id} className="col-12 col-md-6 col-lg-3">
              <KanbanColumn
                id={column.id}
                title={column.title}
                tasks={columns[column.id]}
              />
            </div>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            id={activeTask.id}
            index={0}
            group={activeTask.status}
            title={activeTask.title}
            description={activeTask.description}
            priority={activeTask.priority}
            dueDate={activeTask.dueDate}
            members={activeTask.members}
          />
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}

export default KanbanBoard;

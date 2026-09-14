import KanbanColumn from "../KanbanColumn/KanbanColumn";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import "./KanbanBoard.css";
import { useState, useEffect, useCallback } from "react";
import { move } from "@dnd-kit/helpers";
import TaskCard from "../TaskCard/TaskCard";
import EmptyState from "../../../components/ui/EmptyState/EmptyState.jsx";
import TaskDetailModal from "../../../components/tasks/TaskDetailModal.jsx";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { getTasks, reorderTasks } from "../../../services/taskService.js";

function KanbanBoard() {
  const { workspaceId } = useWorkspace();
  const { t, lang } = useLanguage();
  const [columns, setColumns] = useState({
    todo: [], "in-progress": [], review: [], done: [],
  });
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = useCallback(() => {
    if (!workspaceId) return;
    setLoading(true);
    getTasks(workspaceId)
      .then((tasks) => {
        setColumns({
          todo: tasks.filter((t) => t.status === "todo"),
          "in-progress": tasks.filter((t) => t.status === "in-progress"),
          review: tasks.filter((t) => t.status === "review"),
          done: tasks.filter((t) => t.status === "done"),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const columnsDefinitions = [
    { id: "todo", title: t("toDo") },
    { id: "in-progress", title: t("inProgressStatus") },
    { id: "review", title: t("review") },
    { id: "done", title: t("done") },
  ];

  const filterTasks = (tasks) => {
    let filtered = tasks;
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(term) || (t.description || "").toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const handleDragStart = (event) => {
    const taskId = event.operation.source.id;
    const task = Object.values(columns).flat().find((t) => t._id === taskId || t.id === taskId);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    if (event.canceled) return;
    setColumns((cur) => move(cur, event));
  };

  const handleDragEnd = () => {
    setColumns((cur) => {
      const updated = { ...cur };
      const payload = [];
      Object.entries(updated).forEach(([status, tasks]) => {
        updated[status] = tasks.map((task, index) => {
          payload.push({ id: task._id || task.id, status, order: index });
          return { ...task, status };
        });
      });
      reorderTasks(workspaceId, payload).catch(console.error);
      return updated;
    });
    setActiveTask(null);
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const totalTasks = Object.values(columns).flat().length;
  if (totalTasks === 0) {
    return <EmptyState icon="bi-kanban" title={t("noTasksYet")} description={t("createTasksToSeeHere")} />;
  }

  return (
    <>
      <div className="kanban-filters d-flex gap-3 mb-3 flex-wrap align-items-center">
        <div className="kanban-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder={t("filterTasks")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="kanban-priority-filter d-flex gap-2">
          {["all", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              className={`btn btn-sm kanban-filter-btn ${filterPriority === p ? "active" : ""}`}
              onClick={() => setFilterPriority(p)}
            >
              {p === "all" ? t("all") : p === "high" ? t("high") : p === "medium" ? t("medium") : t("low")}
            </button>
          ))}
        </div>
      </div>

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="kanban-board">
          <div className="row">
            {columnsDefinitions.map((column) => (
              <div key={column.id} className="col-12 col-md-6 col-lg-3">
                <KanbanColumn
                  id={column.id}
                  title={column.title}
                  tasks={filterTasks(columns[column.id])}
                  onTaskClick={handleTaskClick}
                />
              </div>
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              id={activeTask._id || activeTask.id}
              index={0}
              group={activeTask.status}
              title={activeTask.title}
              description={activeTask.description}
              priority={activeTask.priority}
              type={activeTask.type}
              dueDate={activeTask.dueDate ? new Date(activeTask.dueDate).toLocaleDateString(lang === "fr" ? "fr" : "en", { month: "short", day: "numeric" }) : ""}
              members={(activeTask.members || []).map((m) =>
                typeof m === "object" ? { id: m._id, name: m.name, avatar: m.avatar } : m
              )}
            />
          ) : null}
        </DragOverlay>
      </DragDropProvider>

      <TaskDetailModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onUpdate={fetchTasks}
      />
    </>
  );
}

export default KanbanBoard;

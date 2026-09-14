import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getTasks } from "../../services/taskService.js";
import TaskDetailModal from "../../components/tasks/TaskDetailModal.jsx";
import "./Calendar.css";

function CalendarView() {
  const { workspaceId } = useWorkspace();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const data = await getTasks(workspaceId);
      setTasks(data.filter((tk) => tk.dueDate));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    t("january"), t("february"), t("march"), t("april"), t("may"), t("june"),
    t("july"), t("august"), t("september"), t("october"), t("november"), t("december"),
  ];

  const dayNames = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDay = (day) => {
    return tasks.filter((tk) => {
      if (!tk.dueDate) return false;
      const d = new Date(tk.dueDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const daysGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(day);
  }

  return (
    <div className="calendar-page">
      <header className="calendar-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="calendar-title">{t("calendarTitle")}</h2>
          <p className="text-muted mb-0">{t("calendarSubtitle")}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={handlePrevMonth}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <h4 className="mb-0 font-weight-bold" style={{ minWidth: 160, textAlign: "center" }}>
            {monthNames[month]} {year}
          </h4>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleNextMonth}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="calendar-grid-header border-bottom">
            {dayNames.map((dayName) => (
              <div key={dayName} className="text-center py-2 font-weight-bold text-muted small">
                {dayName}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {daysGrid.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="calendar-cell empty"></div>;
              }

              const dayTasks = getTasksForDay(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div key={day} className={`calendar-cell ${isToday ? "today" : ""}`}>
                  <div className="cell-header d-flex justify-content-between align-items-center mb-1">
                    <span className={`day-number ${isToday ? "today-badge" : ""}`}>{day}</span>
                    {dayTasks.length > 0 && (
                      <span className="badge bg-secondary" style={{ fontSize: 10 }}>{dayTasks.length}</span>
                    )}
                  </div>
                  <div className="cell-tasks">
                    {dayTasks.map((tk) => (
                      <div
                        key={tk.id}
                        className={`calendar-task-chip task-type-${tk.type || "task"}`}
                        onClick={() => setSelectedTaskId(tk.id)}
                        title={tk.title}
                      >
                        {tk.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TaskDetailModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
        onUpdate={fetchTasks}
      />
    </div>
  );
}

export default CalendarView;

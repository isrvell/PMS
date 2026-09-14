import { useState, useEffect, useRef } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getTasks } from "../../services/taskService.js";
import "./TaskLinkSearch.css";

function TaskLinkSearch({ onSelect, excludeTaskId }) {
  const { workspaceId } = useWorkspace();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const tasks = await getTasks(workspaceId, { search: query });
        const filtered = tasks.filter(
          (t) => (t.id || t._id) !== excludeTaskId
        );
        setResults(filtered.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, workspaceId, excludeTaskId]);

  const handleSelect = (task) => {
    onSelect(task);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "epic": return <i className="bi bi-lightning-fill" style={{ color: "#9333ea" }}></i>;
      case "story": return <i className="bi bi-bookmark-star-fill text-success"></i>;
      case "bug": return <i className="bi bi-bug-fill text-danger"></i>;
      default: return <i className="bi bi-check2-square text-primary"></i>;
    }
  };

  return (
    <div className="task-link-search" ref={wrapperRef}>
      <div className="tls-input-wrapper">
        <i className="bi bi-search tls-icon"></i>
        <input
          type="text"
          className="form-control form-control-sm tls-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title..."
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && (
          <div className="tls-spinner">
            <div className="spinner-border spinner-border-sm"></div>
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="tls-dropdown">
          {results.map((task) => (
            <div
              key={task.id || task._id}
              className="tls-item"
              onClick={() => handleSelect(task)}
            >
              <span className="tls-item-icon">{getTypeIcon(task.type)}</span>
              <div className="tls-item-content">
                <span className="tls-item-title">{task.title}</span>
                <span className="tls-item-meta">
                  #{(task.id || task._id).slice(0, 8)} · {task.status}
                  {task.project?.name && ` · ${task.project.name}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && query.length >= 2 && !loading && results.length === 0 && (
        <div className="tls-dropdown">
          <div className="tls-empty">No tasks found</div>
        </div>
      )}
    </div>
  );
}

export default TaskLinkSearch;

import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import { createTask } from "../../services/taskService.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

function AddTaskModal({ isOpen, onClose, projectId, onSuccess }) {
  const { workspaceId } = useWorkspace();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("task");
  const [epicId, setEpicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createTask(workspaceId, projectId, {
        title,
        description,
        status,
        priority,
        type,
        epicId: epicId || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setType("task");
      setEpicId("");
      setDueDate("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Issue / Task">
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label htmlFor="task-type" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
              Issue Type
            </label>
            <select className="form-select" id="task-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="task">Task</option>
              <option value="story">User Story</option>
              <option value="bug">Bug</option>
              <option value="epic">Epic</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="task-priority" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
              Priority
            </label>
            <select className="form-select" id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="task-title" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="task-desc" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Description
          </label>
          <textarea
            className="form-control"
            id="task-desc"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label htmlFor="task-status" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
              Status
            </label>
            <select className="form-select" id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="task-due" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
              Due Date
            </label>
            <input
              type="date"
              className="form-control"
              id="task-due"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100"
          disabled={loading}
          style={{
            background: "var(--color-primary)",
            color: "var(--color-bg)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 16px",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          ) : (
            <i className="bi bi-plus-lg me-2"></i>
          )}
          Create Task
        </button>
      </form>
    </Modal>
  );
}

export default AddTaskModal;

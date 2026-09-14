import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import { createProject } from "../../services/projectService.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

function AddProjectModal({ isOpen, onClose, onSuccess }) {
  const { workspaceId } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createProject(workspaceId, {
        name,
        description,
        date: new Date(date).toISOString(),
        status,
        progress: 0,
      });
      setName("");
      setDescription("");
      setDate("");
      setStatus("active");
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Project">
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="proj-name" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Project Name
          </label>
          <input
            type="text"
            className="form-control"
            id="proj-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My New Project"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="proj-desc" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Description
          </label>
          <textarea
            className="form-control"
            id="proj-desc"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief project description"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="proj-date" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Start Date
          </label>
          <input
            type="date"
            className="form-control"
            id="proj-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="proj-status" className="form-label" style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>
            Status
          </label>
          <select
            className="form-select"
            id="proj-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="in-hold">In Hold</option>
            <option value="completed">Completed</option>
          </select>
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
          Create Project
        </button>
      </form>
    </Modal>
  );
}

export default AddProjectModal;

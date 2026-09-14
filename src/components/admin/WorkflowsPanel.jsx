import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getWorkflowStatuses, createWorkflowStatus, deleteWorkflowStatus } from "../../services/workflowService.js";

function WorkflowsPanel() {
  const { workspaceId } = useWorkspace();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("in_progress");
  const [color, setColor] = useState("#3b82f6");
  const [adding, setAdding] = useState(false);

  const fetchStatuses = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const data = await getWorkflowStatuses(workspaceId);
      setStatuses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await createWorkflowStatus(workspaceId, { name, category, color, order: statuses.length });
      setName("");
      fetchStatuses();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkflowStatus(workspaceId, id);
      fetchStatuses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="mb-3 font-weight-bold">Custom Workflow Statuses</h4>
      <p className="text-muted small mb-4">Customize the status columns for issues in this workspace</p>

      {loading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <>
          <div className="list-group mb-4">
            {statuses.map((s) => (
              <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-3">
                  <span style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: s.color }}></span>
                  <strong style={{ fontSize: 15 }}>{s.name}</strong>
                  <span className="badge bg-light text-dark border ms-2">{s.category}</span>
                  {s.isSystem && <span className="badge bg-secondary">System Default</span>}
                </div>
                {!s.isSystem && (
                  <button className="btn btn-sm text-danger" onClick={() => handleDelete(s.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="row g-2 align-items-center bg-light p-3 rounded">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Status Name (e.g. QA Testing)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="todo">To Do Category</option>
                <option value="in_progress">In Progress Category</option>
                <option value="done">Done Category</option>
              </select>
            </div>
            <div className="col-3 col-md-2">
              <input
                type="color"
                className="form-control form-control-color form-control-sm w-100"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="col-3 col-md-3">
              <button type="submit" className="btn btn-sm btn-primary w-100" disabled={adding}>
                <i className="bi bi-plus-lg me-1"></i> Add Status
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default WorkflowsPanel;

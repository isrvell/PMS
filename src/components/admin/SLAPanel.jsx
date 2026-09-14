import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getSLAs, createSLA, deleteSLA } from "../../services/slaService.js";

function SLAPanel() {
  const { workspaceId } = useWorkspace();
  const [slas, setSlas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [priority, setPriority] = useState("high");
  const [targetHours, setTargetHours] = useState(24);
  const [adding, setAdding] = useState(false);

  const fetchSLAs = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const data = await getSLAs(workspaceId);
      setSlas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchSLAs();
  }, [fetchSLAs]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await createSLA(workspaceId, { name, priority, targetHours: Number(targetHours) });
      setName("");
      setTargetHours(24);
      fetchSLAs();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSLA(workspaceId, id);
      fetchSLAs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="mb-3 font-weight-bold">SLA Service Level Agreements</h4>
      <p className="text-muted small mb-4">Set maximum resolution time limits based on task priority</p>

      {loading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <>
          <div className="list-group mb-4">
            {slas.map((s) => (
              <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <strong className="d-block">{s.name}</strong>
                  <span className="badge bg-secondary me-2">{s.priority.toUpperCase()} priority</span>
                  <span className="small text-muted">Target: {s.targetHours} hours</span>
                </div>
                <button className="btn btn-sm text-danger" onClick={() => handleDelete(s.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="row g-2 align-items-center bg-light p-3 rounded">
            <div className="col-12 col-md-5">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Policy Name (e.g. Critical Bug 12h SLA)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select form-select-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="col-3 col-md-2">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Target Hours"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                required
              />
            </div>
            <div className="col-3 col-md-2">
              <button type="submit" className="btn btn-sm btn-primary w-100" disabled={adding}>
                Add SLA
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default SLAPanel;

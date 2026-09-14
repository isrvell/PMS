import { useState, useEffect } from "react";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import {
  getWorkspace,
  updateWorkspace,
  getWorkspaces,
  createWorkspace,
} from "../../../services/workspaceService.js";
import "./WorkspacePanel.css";

function WorkspacePanel() {
  const { workspaceId, switchWorkspace } = useWorkspace();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [allWorkspaces, setAllWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ws, all] = await Promise.all([
        getWorkspace(workspaceId),
        getWorkspaces(),
      ]);
      setWorkspace(ws);
      setName(ws.name);
      setDescription(ws.description || "");
      setAllWorkspaces(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchData();
  }, [workspaceId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await updateWorkspace(workspaceId, { name, description });
      setSaveMsg("Workspace updated");
      fetchData();
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg("");
    try {
      const ws = await createWorkspace({ name: newName, description: newDesc });
      setCreateMsg(`"${ws.name}" created`);
      setNewName("");
      setNewDesc("");
      fetchData();
    } catch (err) {
      setCreateMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSwitch = (id) => {
    switchWorkspace(id);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="workspace-panel">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="ws-card shadow-sm rounded-3 p-4">
            <h5 className="ws-card-title">Current Workspace</h5>
            {saveMsg && (
              <div className={`alert py-2 ${saveMsg.includes("updated") ? "alert-success" : "alert-danger"}`}>
                {saveMsg}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="ws-name" className="form-label ws-label">Name</label>
                <input
                  type="text"
                  className="form-control ws-input"
                  id="ws-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ws-desc" className="form-label ws-label">Description</label>
                <textarea
                  className="form-control ws-input"
                  id="ws-desc"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button type="submit" className="btn ws-save-btn" disabled={saving}>
                  {saving ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="bi bi-check-lg me-2"></i>
                  )}
                  Save Changes
                </button>
                <span className="ws-owner-info">
                  Owner: {workspace?.owner?.name || user?.name}
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="ws-card shadow-sm rounded-3 p-4 mb-4">
            <h5 className="ws-card-title">Create New Workspace</h5>
            {createMsg && (
              <div className={`alert py-2 ${createMsg.includes("created") ? "alert-success" : "alert-danger"}`}>
                {createMsg}
              </div>
            )}
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label htmlFor="new-ws-name" className="form-label ws-label">Name</label>
                <input
                  type="text"
                  className="form-control ws-input"
                  id="new-ws-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My New Workspace"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="new-ws-desc" className="form-label ws-label">Description</label>
                <input
                  type="text"
                  className="form-control ws-input"
                  id="new-ws-desc"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <button type="submit" className="btn ws-create-btn" disabled={creating}>
                {creating ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : (
                  <i className="bi bi-plus-lg me-2"></i>
                )}
                Create Workspace
              </button>
            </form>
          </div>

          {allWorkspaces.length > 1 && (
            <div className="ws-card shadow-sm rounded-3 p-4">
              <h5 className="ws-card-title">Switch Workspace</h5>
              <div className="ws-list">
                {allWorkspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className={`ws-list-item ${ws.id === workspaceId ? "active" : ""}`}
                  >
                    <div>
                      <span className="ws-list-name">{ws.name}</span>
                      {ws.id === workspaceId && (
                        <span className="ws-current-badge">Current</span>
                      )}
                    </div>
                    {ws.id !== workspaceId && (
                      <button
                        className="btn btn-sm ws-switch-btn"
                        onClick={() => handleSwitch(ws.id)}
                      >
                        Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkspacePanel;

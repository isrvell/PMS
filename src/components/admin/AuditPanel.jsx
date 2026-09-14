import { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { getAuditLogs } from "../../services/slaService.js";
import Avatar from "../ui/Avatar/Avatar.jsx";

function AuditPanel() {
  const { workspaceId } = useWorkspace();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const data = await getAuditLogs(workspaceId);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="mb-3 font-weight-bold">Workspace Audit Trail</h4>
      <p className="text-muted small mb-4">Complete history of security events, status changes, and task activities</p>

      {loading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : logs.length === 0 ? (
        <div className="text-muted text-center py-4">No audit activity logged yet</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Avatar size={24} src={log.user?.avatar} name={log.user?.name} />
                      <span className="small font-weight-bold">{log.user?.name || "System"}</span>
                    </div>
                  </td>
                  <td><span className="small">{log.action}</span></td>
                  <td><span className="badge bg-light text-dark border">{log.entityType || "general"}</span></td>
                  <td>
                    <span className="small text-muted">
                      {new Date(log.createdAt).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditPanel;

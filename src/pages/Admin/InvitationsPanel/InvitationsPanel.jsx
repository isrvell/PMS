import { useState } from "react";
import EmptyState from "../../../components/ui/EmptyState/EmptyState.jsx";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import {
  createInvitation,
  getInvitations,
  revokeInvitation,
  resendInvitation,
} from "../../../services/invitationService.js";
import useApi from "../../../hooks/useApi.js";
import "./InvitationsPanel.css";

function InvitationsPanel() {
  const { workspaceId } = useWorkspace();
  const { data: invitations, loading, refetch } = useApi(
    () => getInvitations(workspaceId),
    [workspaceId]
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionId, setActionId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);
    try {
      const result = await createInvitation(workspaceId, email, role);
      if (result.emailSent) {
        setSuccess(`Invitation sent to ${email}`);
      } else {
        setSuccess(
          `Invitation created for ${email} — email couldn't be delivered. Use the copy link button to share manually.`
        );
      }
      setEmail("");
      setRole("member");
      refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async (inviteUrl, id) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRevoke = async (id) => {
    setActionId(id);
    try {
      await revokeInvitation(workspaceId, id);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleResend = async (id) => {
    setActionId(id);
    try {
      await resendInvitation(workspaceId, id);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  const statusColors = {
    pending: { bg: "#F0F0F0", color: "#555555" },
    accepted: { bg: "#d4edda", color: "#155724" },
    expired: { bg: "#F5F5F5", color: "#999999" },
    revoked: { bg: "#E8E8E8", color: "#444444" },
  };

  return (
    <div className="invitations-panel">
      <form onSubmit={handleInvite} className="invite-form shadow-sm rounded-3 p-3 mb-4">
        <h5 className="invite-form-title mb-3">Send Invitation</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}
        <div className="d-flex gap-3 flex-wrap align-items-end">
          <div className="flex-grow-1">
            <label htmlFor="inv-email" className="form-label inv-label">Email</label>
            <input
              type="email"
              className="form-control inv-input"
              id="inv-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </div>
          <div>
            <label htmlFor="inv-role" className="form-label inv-label">Role</label>
            <select
              className="form-select inv-input"
              id="inv-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn inv-send-btn" disabled={sending}>
            {sending ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : (
              <i className="bi bi-send me-2"></i>
            )}
            Send
          </button>
        </div>
      </form>

      <h5 className="inv-list-title mb-3">
        Invitations
        <span className="inv-count">{invitations?.length || 0}</span>
      </h5>

      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : !invitations?.length ? (
        <EmptyState
          icon="bi-envelope"
          title="No invitations yet"
          description="Send an invitation above to get started"
        />
      ) : (
        <div className="inv-list">
          {invitations.map((inv) => {
            const sc = statusColors[inv.status] || statusColors.pending;
            return (
              <div key={inv.id} className="inv-row shadow-sm rounded-3 p-3 mb-3">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="inv-info flex-grow-1">
                    <span className="inv-email">{inv.email}</span>
                    <span className="inv-meta">
                      {inv.role} &middot; {new Date(inv.createdAt).toLocaleDateString()}
                      {inv.invitedBy && ` \u00B7 by ${inv.invitedBy.name}`}
                    </span>
                  </div>
                  <span
                    className="inv-status-badge"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {inv.status}
                  </span>
                  {inv.status === "pending" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm inv-copy-btn"
                        onClick={() => handleCopyLink(inv.inviteUrl, inv.id)}
                        title={copiedId === inv.id ? "Copied!" : "Copy invite link"}
                      >
                        <i className={`bi ${copiedId === inv.id ? "bi-check-lg text-success" : "bi-link-45deg"}`}></i>
                      </button>
                      <button
                        className="btn btn-sm inv-action-btn"
                        onClick={() => handleResend(inv.id)}
                        disabled={actionId === inv.id}
                        title="Resend invitation"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                      <button
                        className="btn btn-sm inv-revoke-btn"
                        onClick={() => handleRevoke(inv.id)}
                        disabled={actionId === inv.id}
                        title="Revoke invitation"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InvitationsPanel;

import { useState } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import { createInvitation } from "../../services/invitationService.js";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import "./InviteModal.css";

function InviteModal({ isOpen, onClose, onSuccess }) {
  const { workspaceId } = useWorkspace();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createInvitation(workspaceId, email, role);
      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
      setRole("member");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("member");
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Member">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="invite-email" className="form-label invite-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control invite-input"
            id="invite-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="invite-role" className="form-label invite-label">
            Role
          </label>
          <select
            className="form-select invite-input"
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn invite-submit-btn w-100"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          ) : (
            <i className="bi bi-send me-2"></i>
          )}
          Send Invitation
        </button>
      </form>
    </Modal>
  );
}

export default InviteModal;

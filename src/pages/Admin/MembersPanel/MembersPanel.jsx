import { useState } from "react";
import Avatar from "../../../components/ui/Avatar/Avatar.jsx";
import EmptyState from "../../../components/ui/EmptyState/EmptyState.jsx";
import { updateMemberRole, removeMember } from "../../../services/workspaceService.js";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import "./MembersPanel.css";

function MembersPanel({ members, onRefresh }) {
  const { workspaceId } = useWorkspace();
  const [loadingId, setLoadingId] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    setLoadingId(userId);
    try {
      await updateMemberRole(workspaceId, userId, newRole);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (userId, name) => {
    if (!confirm(`Remove ${name} from the workspace?`)) return;
    setLoadingId(userId);
    try {
      await removeMember(workspaceId, userId);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (members.length === 0) {
    return (
      <EmptyState
        icon="bi-people"
        title="No members"
        description="Invite people to your workspace to see them here"
      />
    );
  }

  return (
    <div className="members-panel">
      <div className="members-count mb-3">
        <span className="text-muted">{members.length} members</span>
      </div>
      <div className="members-list">
        {members.map((m) => {
          const user = m.user || {};
          const userId = user._id || user.id;
          return (
            <div key={userId} className="member-row shadow-sm rounded-3 p-3 mb-3">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Avatar size={42} src={user.avatar} name={user.name} />
                <div className="member-info flex-grow-1">
                  <h5 className="member-name">{user.name}</h5>
                  <span className="member-email">{user.email}</span>
                </div>
                <span className={`role-badge role-${m.role}`}>
                  {m.role === "admin" ? "Admin" : "Member"}
                </span>
                <div className="member-actions d-flex gap-2">
                  <select
                    className="form-select form-select-sm role-select"
                    value={m.role}
                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                    disabled={loadingId === userId}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="btn btn-sm remove-btn"
                    onClick={() => handleRemove(userId, user.name)}
                    disabled={loadingId === userId}
                    title="Remove member"
                  >
                    <i className="bi bi-person-x"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MembersPanel;

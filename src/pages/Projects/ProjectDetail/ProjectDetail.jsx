import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../../../context/WorkspaceContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import useApi from "../../../hooks/useApi.js";
import Avatar from "../../../components/ui/Avatar/Avatar.jsx";
import Priority from "../../../components/ui/Priority/Priority.jsx";
import EmptyState from "../../../components/ui/EmptyState/EmptyState.jsx";
import { useTranslatedStatuses } from "../../../constants/statuses.js";
import apiFetch from "../../../services/api.js";
import { getResources, uploadResource, deleteResource } from "../../../services/resourceService.js";
import { addMemberToProject, removeMemberFromProject } from "../../../services/projectService.js";
import { getWorkspaceMembers } from "../../../services/workspaceService.js";
import AddTaskModal from "../../../components/admin/AddTaskModal.jsx";
import "./ProjectDetail.css";

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(mimeType) {
  if (mimeType.startsWith("image/")) return "bi-file-image text-success";
  if (mimeType === "application/pdf") return "bi-file-pdf text-danger";
  if (mimeType.includes("word") || mimeType.includes("document")) return "bi-file-word text-primary";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "bi-file-excel text-success";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "bi-file-ppt text-warning";
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) return "bi-file-zip text-secondary";
  if (mimeType.startsWith("text/")) return "bi-file-text text-info";
  return "bi-file-earmark text-muted";
}

function ProjectDetail() {
  const { projectId } = useParams();
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const { data: project, loading, error, refetch } = useApi(
    () => apiFetch(`/workspaces/${workspaceId}/projects/${projectId}`),
    [workspaceId, projectId]
  );

  const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useApi(
    () => apiFetch(`/workspaces/${workspaceId}/tasks?project=${projectId}`),
    [workspaceId, projectId]
  );

  const { data: resources, loading: resourcesLoading, refetch: refetchResources } = useApi(
    () => getResources(workspaceId, projectId),
    [workspaceId, projectId]
  );

  const { data: allWorkspaceMembers } = useApi(
    () => isAdmin ? getWorkspaceMembers(workspaceId) : Promise.resolve([]),
    [workspaceId, isAdmin]
  );

  const [showAddTask, setShowAddTask] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editProgress, setEditProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showAddMember, setShowAddMember] = useState(false);

  const startEdit = () => {
    setEditName(project.name);
    setEditDesc(project.description || "");
    setEditStatus(project.status);
    setEditProgress(project.progress);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          status: editStatus,
          progress: Number(editProgress),
        }),
      });
      setEditing(false);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
        method: "DELETE",
      });
      navigate("/projects");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert(t("fileTooLarge"));
      return;
    }
    setUploading(true);
    try {
      await uploadResource(workspaceId, projectId, file);
      refetchResources();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm(t("deleteResourceConfirm"))) return;
    try {
      await deleteResource(workspaceId, resourceId);
      refetchResources();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await addMemberToProject(workspaceId, projectId, userId);
      setShowAddMember(false);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm(t("removeMemberConfirm"))) return;
    try {
      await removeMemberFromProject(workspaceId, projectId, userId);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container-fluid px-5 py-5">
        <div className="alert alert-danger">{error || "Project not found"}</div>
        <button className="btn" onClick={() => navigate("/projects")} style={{ color: "var(--color-primary)" }}>
          <i className="bi bi-arrow-left me-2"></i>{t("backToProjects")}
        </button>
      </div>
    );
  }

  const { projectStatuses } = useTranslatedStatuses();
  const status = projectStatuses[project.status] || {};
  const members = project.projectMembers?.map((pm) => pm.user) || project.members || [];
  const taskList = tasks || [];
  const resourceList = resources || [];
  const dateLoc = lang === "fr" ? "fr" : "en";

  const statusLabels = {
    todo: t("toDo"),
    "in-progress": t("inProgressStatus"),
    review: t("review"),
    done: t("done"),
  };

  const tasksByStatus = {
    todo: taskList.filter((tk) => tk.status === "todo"),
    "in-progress": taskList.filter((tk) => tk.status === "in-progress"),
    review: taskList.filter((tk) => tk.status === "review"),
    done: taskList.filter((tk) => tk.status === "done"),
  };

  return (
    <section className="project-detail">
      <div className="container-fluid px-5 py-5">
        <button className="btn back-btn mb-3" onClick={() => navigate("/projects")}>
          <i className="bi bi-arrow-left me-2"></i>{t("backToProjects")}
        </button>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="detail-card shadow-sm rounded-3 p-4">
              {editing ? (
                <div className="edit-form">
                  <div className="mb-3">
                    <label className="form-label detail-label">{t("projectName")}</label>
                    <input className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label detail-label">{t("description")}</label>
                    <textarea className="form-control" rows="3" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label detail-label">{t("status")}</label>
                      <select className="form-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="active">{t("active")}</option>
                        <option value="in-hold">{t("inHold")}</option>
                        <option value="completed">{t("completed")}</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label detail-label">{t("progress")} ({editProgress}%)</label>
                      <input type="range" className="form-range" min="0" max="100" value={editProgress} onChange={(e) => setEditProgress(e.target.value)} />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-lg me-2"></i>}
                      {t("save")}
                    </button>
                    <button className="btn cancel-btn" onClick={() => setEditing(false)}>{t("cancel")}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 className="detail-title">{project.name}</h2>
                      <p className="detail-desc">{project.description}</p>
                    </div>
                    {isAdmin && (
                      <div className="d-flex gap-2">
                        <button className="btn edit-btn" onClick={startEdit}>
                          <i className="bi bi-pencil me-1"></i>{t("edit")}
                        </button>
                        <button className="btn delete-btn" onClick={handleDelete}>
                          <i className="bi bi-trash me-1"></i>{t("delete")}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                    <span className="detail-status-badge" style={{ background: status.color, color: "var(--color-bg)" }}>
                      {status.label}
                    </span>
                    <span className="detail-date">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(project.date).toLocaleDateString(dateLoc, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="detail-members-count">
                      <i className="bi bi-people me-1"></i>
                      {members.length} {t("membersCount")}
                    </span>
                  </div>

                  <div className="progress-section">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="detail-label">{t("progress")}</span>
                      <span className="detail-progress-value">{project.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${project.progress}%`, background: status.color }}></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tabs: Tasks / Resources */}
            <div className="detail-tabs mt-4 d-flex gap-1 mb-0">
              <button
                className={`detail-tab-btn ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <i className="bi bi-list-task me-2"></i>{t("tasks")}
                <span className="tab-count">{taskList.length}</span>
              </button>
              <button
                className={`detail-tab-btn ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                <i className="bi bi-paperclip me-2"></i>{t("resources")}
                <span className="tab-count">{resourceList.length}</span>
              </button>
            </div>

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="detail-card shadow-sm rounded-3 p-4" style={{ borderTopLeftRadius: 0 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="detail-section-title mb-0">{t("tasks")}</h5>
                  <button className="btn add-task-btn" onClick={() => setShowAddTask(true)}>
                    <i className="bi bi-plus-lg me-1"></i>{t("addTask")}
                  </button>
                </div>

                {tasksLoading ? (
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  </div>
                ) : taskList.length === 0 ? (
                  <EmptyState icon="bi-list-task" title={t("noTasks")} description={t("tasksWillAppearHere")} />
                ) : (
                  <div className="task-columns">
                    {Object.entries(tasksByStatus).map(([statusKey, statusTasks]) => (
                      statusTasks.length > 0 && (
                        <div key={statusKey} className="task-status-group mb-3">
                          <h6 className="task-status-label">{statusLabels[statusKey] || statusKey}</h6>
                          {statusTasks.map((task) => (
                            <div key={task._id || task.id} className="task-row">
                              <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <span className="task-row-title">{task.title}</span>
                                <Priority level={task.priority} />
                              </div>
                              {task.dueDate && (
                                <span className="task-row-date">
                                  {new Date(task.dueDate).toLocaleDateString(dateLoc, { month: "short", day: "numeric" })}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === "resources" && (
              <div className="detail-card shadow-sm rounded-3 p-4" style={{ borderTopLeftRadius: 0 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="detail-section-title mb-0">{t("resources")}</h5>
                  <label className={`btn add-task-btn mb-0 ${uploading ? "disabled" : ""}`}>
                    {uploading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <i className="bi bi-upload me-2"></i>
                    )}
                    {t("uploadFile")}
                    <input type="file" hidden onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>

                {resourcesLoading ? (
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  </div>
                ) : resourceList.length === 0 ? (
                  <EmptyState icon="bi-folder2-open" title={t("noResources")} description={t("noResourcesDesc")} />
                ) : (
                  <div className="resource-list">
                    {resourceList.map((res) => (
                      <div key={res.id} className="resource-row d-flex align-items-center gap-3 p-3 rounded mb-2">
                        <i className={`bi ${getFileIcon(res.mimeType)} resource-icon`}></i>
                        <div className="flex-grow-1 min-width-0">
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-name text-truncate d-block"
                            title={res.originalName}
                          >
                            {res.name}
                          </a>
                          <div className="resource-meta">
                            {formatFileSize(res.size)} • {res.uploader?.name || "—"} • {new Date(res.createdAt).toLocaleDateString(dateLoc, { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <a href={res.url} download className="btn btn-sm btn-outline-secondary" title={t("download")}>
                            <i className="bi bi-download"></i>
                          </a>
                          {isAdmin && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteResource(res.id)} title={t("delete")}>
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="detail-card shadow-sm rounded-3 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="detail-section-title mb-0">{t("membersCount")}</h5>
                {isAdmin && (
                  <button
                    className="btn add-task-btn"
                    onClick={() => setShowAddMember(!showAddMember)}
                  >
                    <i className={`bi ${showAddMember ? "bi-x-lg" : "bi-person-plus"} me-1`}></i>
                    {showAddMember ? t("cancel") : t("addMember")}
                  </button>
                )}
              </div>

              {showAddMember && (
                <div className="add-member-dropdown mb-3">
                  {(allWorkspaceMembers || []).filter((wm) => {
                    const uid = wm.user?.id || wm.userId;
                    return !members.some((m) => (m.id || m._id) === uid);
                  }).length === 0 ? (
                    <p className="detail-empty-text">{t("memberAlreadyAdded")}</p>
                  ) : (
                    <div className="member-select-list">
                      {(allWorkspaceMembers || []).filter((wm) => {
                        const uid = wm.user?.id || wm.userId;
                        return !members.some((m) => (m.id || m._id) === uid);
                      }).map((wm) => {
                        const u = wm.user || wm;
                        return (
                          <div
                            key={u.id}
                            className="member-select-item d-flex align-items-center gap-2 p-2 rounded"
                            onClick={() => handleAddMember(u.id)}
                          >
                            <Avatar size={28} src={u.avatar} name={u.name} />
                            <div className="flex-grow-1">
                              <span className="member-detail-name">{u.name}</span>
                              <span className="member-detail-email">{u.email}</span>
                            </div>
                            <i className="bi bi-plus-circle text-success"></i>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {members.length === 0 ? (
                <p className="detail-empty-text">{t("noMembersAssigned")}</p>
              ) : (
                <div className="member-list">
                  {members.map((m) => (
                    <div key={m.id || m._id} className="member-row-detail">
                      <Avatar size={36} src={m.avatar} name={m.name} />
                      <div className="flex-grow-1">
                        <span className="member-detail-name">{m.name}</span>
                        <span className="member-detail-email">{m.email}</span>
                      </div>
                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-outline-danger member-remove-btn"
                          onClick={() => handleRemoveMember(m.id || m._id)}
                          title={t("delete")}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        projectId={projectId}
        onSuccess={refetchTasks}
      />
    </section>
  );
}

export default ProjectDetail;

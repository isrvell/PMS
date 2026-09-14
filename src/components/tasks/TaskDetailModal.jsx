import { useState, useEffect } from "react";
import Modal from "../ui/Modal/Modal.jsx";
import Avatar from "../ui/Avatar/Avatar.jsx";
import Priority from "../ui/Priority/Priority.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getTask, updateTask, addComment, deleteComment, createSubtask,
  createTaskLink, deleteTaskLink,
} from "../../services/taskService.js";
import TaskLinkSearch from "./TaskLinkSearch.jsx";
import "./TaskDetailModal.css";

function TaskDetailModal({ isOpen, onClose, taskId, onUpdate }) {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [saving, setSaving] = useState(false);

  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [creatingSubtask, setCreatingSubtask] = useState(false);

  const [linkTarget, setLinkTarget] = useState(null);
  const [linkType, setLinkType] = useState("related");
  const [creatingLink, setCreatingLink] = useState(false);

  const fetchTask = async () => {
    if (!workspaceId || !taskId) return;
    setLoading(true);
    try {
      const data = await getTask(workspaceId, taskId);
      setTask(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) fetchTask();
  }, [isOpen, taskId, workspaceId]);

  const startEdit = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTask(workspaceId, taskId, {
        title: editTitle, description: editDesc,
        status: editStatus, priority: editPriority,
      });
      setEditing(false);
      fetchTask();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await addComment(workspaceId, taskId, comment);
      setComment("");
      fetchTask();
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(workspaceId, taskId, commentId);
      fetchTask();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;
    setCreatingSubtask(true);
    try {
      await createSubtask(workspaceId, taskId, { title: subtaskTitle });
      setSubtaskTitle("");
      fetchTask();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingSubtask(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!linkTarget) return;
    setCreatingLink(true);
    try {
      await createTaskLink(workspaceId, taskId, linkTarget.id || linkTarget._id, linkType);
      setLinkTarget(null);
      fetchTask();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingLink(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await deleteTaskLink(workspaceId, taskId, linkId);
      fetchTask();
    } catch (err) {
      alert(err.message);
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      epic: { bg: "purple", label: "Epic", icon: "bi-lightning-fill" },
      story: { bg: "#22c55e", label: "Story", icon: "bi-bookmark-star-fill" },
      bug: { bg: "#ef4444", label: "Bug", icon: "bi-bug-fill" },
      task: { bg: "#3b82f6", label: "Task", icon: "bi-check2-square" },
    };
    const b = badges[type] || badges.task;
    return (
      <span className="badge me-1" style={{ background: b.bg, color: "#fff" }}>
        <i className={`bi ${b.icon} me-1`}></i>{b.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={loading ? "Loading..." : task?.title || "Task"}>
      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : !task ? (
        <p>Task not found</p>
      ) : (
        <div className="task-detail">
          {editing ? (
            <div className="td-edit">
              <div className="mb-2">
                <input className="form-control td-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
              </div>
              <div className="mb-2">
                <textarea className="form-control td-input" rows="2" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
              </div>
              <div className="d-flex gap-2 mb-3">
                <select className="form-select form-select-sm td-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <select className="form-select form-select-sm td-input" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm td-save-btn" onClick={handleSave} disabled={saving}>Save</button>
                <button className="btn btn-sm td-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="td-header">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                {getTypeBadge(task.type)}
                <span className={`td-status td-status-${task.status}`}>{task.status.replace("-", " ")}</span>
                <Priority level={task.priority} />
                {task.dueDate && (
                  <span className="td-due">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(task.dueDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
                <button className="btn btn-sm td-edit-btn ms-auto" onClick={startEdit}>
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              {task.description && <p className="td-desc">{task.description}</p>}
              {task.project && <span className="td-project"><i className="bi bi-folder me-1"></i>{task.project.name}</span>}
              {task.members?.length > 0 && (
                <div className="td-members mt-2">
                  {task.members.map((m) => (
                    <Avatar key={m.id} size={28} src={m.avatar} name={m.name} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="td-tabs mt-3">
            <button className={`td-tab ${activeTab === "comments" ? "active" : ""}`} onClick={() => setActiveTab("comments")}>
              Comments ({task.comments?.length || 0})
            </button>
            <button className={`td-tab ${activeTab === "subtasks" ? "active" : ""}`} onClick={() => setActiveTab("subtasks")}>
              Subtasks ({task.subtasks?.length || 0})
            </button>
            <button className={`td-tab ${activeTab === "links" ? "active" : ""}`} onClick={() => setActiveTab("links")}>
              Links ({task.links?.length || 0})
            </button>
          </div>

          {activeTab === "comments" && (
            <div className="td-comments">
              {(task.comments || []).map((c) => (
                <div key={c.id} className="td-comment">
                  <Avatar size={28} src={c.author?.avatar} name={c.author?.name} />
                  <div className="td-comment-body">
                    <div className="td-comment-header">
                      <strong>{c.author?.name}</strong>
                      <span className="td-comment-time">
                        {new Date(c.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                      {(c.userId === user?.id || user?.role === "admin") && (
                        <button className="btn btn-sm td-comment-delete" onClick={() => handleDeleteComment(c.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    <p className="td-comment-text">{c.content}</p>
                  </div>
                </div>
              ))}
              <form onSubmit={handleComment} className="td-comment-form">
                <input
                  className="form-control td-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  required
                />
                <button type="submit" className="btn btn-sm td-post-btn" disabled={posting}>
                  {posting ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-send"></i>}
                </button>
              </form>
            </div>
          )}

          {activeTab === "subtasks" && (
            <div className="td-subtasks">
              {(task.subtasks || []).map((s) => (
                <div key={s.id || s._id} className="td-subtask">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={s.status === "done"}
                    onChange={async () => {
                      const newStatus = s.status === "done" ? "todo" : "done";
                      await updateTask(workspaceId, s.id || s._id, { status: newStatus });
                      fetchTask();
                      if (onUpdate) onUpdate();
                    }}
                  />
                  <span className={`td-subtask-title ${s.status === "done" ? "done" : ""}`}>{s.title}</span>
                  <Priority level={s.priority} />
                </div>
              ))}
              <form onSubmit={handleAddSubtask} className="td-subtask-form">
                <input
                  className="form-control td-input"
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  required
                />
                <button type="submit" className="btn btn-sm td-post-btn" disabled={creatingSubtask}>
                  <i className="bi bi-plus-lg"></i>
                </button>
              </form>
            </div>
          )}

          {activeTab === "links" && (
            <div className="td-links">
              {(task.links || []).map((l) => (
                <div key={l.id} className="td-subtask d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="badge bg-secondary me-2">{l.direction === "outgoing" ? l.linkType : `is ${l.linkType}`}</span>
                    <strong>{l.task?.title || "Task"}</strong>
                  </div>
                  <button className="btn btn-sm text-danger" onClick={() => handleDeleteLink(l.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
              <form onSubmit={handleAddLink} className="td-link-form mt-3">
                <div className="d-flex gap-2 align-items-start flex-wrap">
                  <select className="form-select form-select-sm td-input" style={{ width: 140, flexShrink: 0 }} value={linkType} onChange={(e) => setLinkType(e.target.value)}>
                    <option value="blocks">Blocks</option>
                    <option value="is-blocked-by">Is Blocked By</option>
                    <option value="duplicate">Duplicate of</option>
                    <option value="related">Relates to</option>
                  </select>
                  <TaskLinkSearch
                    onSelect={setLinkTarget}
                    excludeTaskId={taskId}
                  />
                  <button type="submit" className="btn btn-sm td-post-btn" disabled={creatingLink || !linkTarget} style={{ flexShrink: 0 }}>
                    {creatingLink ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-link-45deg me-1"></i>Link</>}
                  </button>
                </div>
                {linkTarget && (
                  <div className="td-link-preview mt-2">
                    <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 p-2">
                      <i className="bi bi-link-45deg text-primary"></i>
                      {linkTarget.title}
                      <i className="bi bi-x ms-1 cursor-pointer" onClick={() => setLinkTarget(null)}></i>
                    </span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default TaskDetailModal;

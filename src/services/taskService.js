import apiFetch from "./api.js";

export const getTasks = (workspaceId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.project) params.set("project", filters.project);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.type) params.set("type", filters.type);
  if (filters.epic) params.set("epic", filters.epic);
  if (filters.sprint) params.set("sprint", filters.sprint);
  if (filters.backlog) params.set("backlog", filters.backlog);
  if (filters.release) params.set("release", filters.release);
  const query = params.toString() ? `?${params}` : "";
  return apiFetch(`/workspaces/${workspaceId}/tasks${query}`);
};

export const getTask = (workspaceId, taskId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}`);

export const getTaskLinks = (workspaceId, taskId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/links`);

export const createTaskLink = (workspaceId, taskId, targetTaskId, linkType) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/links`, {
    method: "POST",
    body: JSON.stringify({ targetTaskId, linkType }),
  });

export const deleteTaskLink = (workspaceId, taskId, linkId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/links/${linkId}`, {
    method: "DELETE",
  });

export const createTask = (workspaceId, projectId, data) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTask = (workspaceId, taskId, data) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const updateTaskStatus = (workspaceId, taskId, status) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const reorderTasks = (workspaceId, tasks) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ tasks }),
  });

export const deleteTask = (workspaceId, taskId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}`, { method: "DELETE" });

export const createSubtask = (workspaceId, taskId, data) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/subtasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getComments = (workspaceId, taskId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/comments`);

export const addComment = (workspaceId, taskId, content) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const deleteComment = (workspaceId, taskId, commentId) =>
  apiFetch(`/workspaces/${workspaceId}/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
  });

export const searchWorkspace = (workspaceId, query) =>
  apiFetch(`/workspaces/${workspaceId}/search?q=${encodeURIComponent(query)}`);

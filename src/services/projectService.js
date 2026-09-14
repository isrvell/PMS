import apiFetch from "./api.js";

export const getProjects = (workspaceId, status) => {
  const query = status && status !== "all" ? `?status=${status}` : "";
  return apiFetch(`/workspaces/${workspaceId}/projects${query}`);
};

export const createProject = (workspaceId, data) =>
  apiFetch(`/workspaces/${workspaceId}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProject = (workspaceId, projectId, data) =>
  apiFetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProject = (workspaceId, projectId) =>
  apiFetch(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: "DELETE",
  });

export const addMemberToProject = (workspaceId, projectId, userId) =>
  apiFetch(`/workspaces/${workspaceId}/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

export const removeMemberFromProject = (workspaceId, projectId, userId) =>
  apiFetch(`/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });

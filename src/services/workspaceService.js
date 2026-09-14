import apiFetch from "./api.js";

export const getWorkspaceMembers = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/members`);

export const updateMemberRole = (workspaceId, userId, role) =>
  apiFetch(`/workspaces/${workspaceId}/members/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });

export const removeMember = (workspaceId, userId) =>
  apiFetch(`/workspaces/${workspaceId}/members/${userId}`, {
    method: "DELETE",
  });

export const getWorkspace = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}`);

export const updateWorkspace = (workspaceId, data) =>
  apiFetch(`/workspaces/${workspaceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const getWorkspaces = () =>
  apiFetch("/workspaces");

export const createWorkspace = (data) =>
  apiFetch("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });

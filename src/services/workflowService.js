import apiFetch from "./api.js";

export const getWorkflowStatuses = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/workflows/statuses`);

export const createWorkflowStatus = (workspaceId, data) =>
  apiFetch(`/workspaces/${workspaceId}/workflows/statuses`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWorkflowStatus = (workspaceId, statusId, data) =>
  apiFetch(`/workspaces/${workspaceId}/workflows/statuses/${statusId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWorkflowStatus = (workspaceId, statusId) =>
  apiFetch(`/workspaces/${workspaceId}/workflows/statuses/${statusId}`, {
    method: "DELETE",
  });

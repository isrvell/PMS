import apiFetch from "./api.js";

export const getVelocityReport = (workspaceId, projectId) =>
  apiFetch(`/workspaces/${workspaceId}/reports/velocity${projectId ? `?projectId=${projectId}` : ""}`);

export const getCreatedVsResolvedReport = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/reports/created-vs-resolved`);

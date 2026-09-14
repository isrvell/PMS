import apiFetch from "./api.js";

export const getDashboardData = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/dashboard`);

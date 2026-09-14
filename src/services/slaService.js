import apiFetch from "./api.js";

export const getSLAs = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/sla`);

export const createSLA = (workspaceId, data) =>
  apiFetch(`/workspaces/${workspaceId}/sla`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteSLA = (workspaceId, slaId) =>
  apiFetch(`/workspaces/${workspaceId}/sla/${slaId}`, {
    method: "DELETE",
  });

export const getAuditLogs = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/sla/audit-logs`);

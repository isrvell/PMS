import apiFetch from "./api.js";

export const createInvitation = (workspaceId, email, role) =>
  apiFetch(`/workspaces/${workspaceId}/invitations`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });

export const getInvitations = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/invitations`);

export const revokeInvitation = (workspaceId, invitationId) =>
  apiFetch(`/workspaces/${workspaceId}/invitations/${invitationId}`, {
    method: "DELETE",
  });

export const resendInvitation = (workspaceId, invitationId) =>
  apiFetch(`/workspaces/${workspaceId}/invitations/${invitationId}/resend`, {
    method: "POST",
  });

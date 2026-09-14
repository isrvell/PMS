import apiFetch from "./api.js";

export const getTeamMembers = (workspaceId, department) => {
  const query = department && department !== "all" ? `?department=${department}` : "";
  return apiFetch(`/workspaces/${workspaceId}/team${query}`);
};

export const updateTeamMember = (workspaceId, memberId, data) =>
  apiFetch(`/workspaces/${workspaceId}/team/${memberId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

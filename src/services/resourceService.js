import apiFetch from "./api.js";

export const getResources = async (workspaceId, projectId) => {
  return apiFetch(`/workspaces/${workspaceId}/projects/${projectId}/resources`);
};

export const uploadResource = async (workspaceId, projectId, file, name) => {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);

  const token = localStorage.getItem("token");
  const res = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}/resources`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Upload failed");
  }

  return res.json();
};

export const deleteResource = async (workspaceId, resourceId) => {
  return apiFetch(`/workspaces/${workspaceId}/resources/${resourceId}`, {
    method: "DELETE",
  });
};

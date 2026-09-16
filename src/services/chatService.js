import apiFetch from "./api.js";

export const getChannels = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/chat/channels`);

export const createChannel = (workspaceId, data) =>
  apiFetch(`/workspaces/${workspaceId}/chat/channels`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getOrCreateDirectChannel = (workspaceId, targetUserId) =>
  apiFetch(`/workspaces/${workspaceId}/chat/direct`, {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });

export const getChannelMessages = (workspaceId, channelId) =>
  apiFetch(`/workspaces/${workspaceId}/chat/channels/${channelId}/messages`);

export const sendChannelMessage = (workspaceId, channelId, data) =>
  apiFetch(`/workspaces/${workspaceId}/chat/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify(data),
  });

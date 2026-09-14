import apiFetch from "./api.js";

export const login = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (token, name, password) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ token, name, password }),
  });

export const validateInvite = (token) =>
  apiFetch(`/auth/validate-invite/${token}`, { method: "POST" });

export const getMe = () => apiFetch("/auth/me");

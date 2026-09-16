const API_BASE = "/api";

async function apiFetch(endpoint, options = {}, skipAuth = false) {
  const token = !skipAuth ? localStorage.getItem("token") : null;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  if (res.status === 401 && !skipAuth) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "API Error");
  }

  return res.json();
}

export default apiFetch;

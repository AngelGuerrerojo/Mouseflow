const PROD_API_BASE = "https://mouseflow.onrender.com/api";

function getLocalApiBase() {
  if (typeof window === "undefined") {
    return PROD_API_BASE;
  }

  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:3000/api`;
}

function resolveApiBase() {
  const configuredBase = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");

  if (typeof window === "undefined") {
    return configuredBase || PROD_API_BASE;
  }

  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  // Si el build de produccion llega con un VITE_API_URL mal configurado a localhost,
  // lo corregimos en tiempo de ejecucion para no romper el despliegue.
  if (configuredBase) {
    if (!isLocalHost && configuredBase.includes("localhost")) {
      return PROD_API_BASE;
    }
    return configuredBase;
  }

  return isLocalHost ? getLocalApiBase() : PROD_API_BASE;
}

export const API_BASE = resolveApiBase();

async function apiFetch(path, options = {}) {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const message = data?.message || "Error de red";
    const error = new Error(message);
    error.status = resp.status;
    throw error;
  }
  return data;
}

export const authApi = {
  login: (correo, password) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ correo, password }) }),
  register: (correo, password) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ correo, password }) }),
};

export const userApi = {
  getProfile: (userId) => apiFetch(`/usuarios/${userId}`),
  updateProfile: (userId, payload) => apiFetch(`/usuarios/${userId}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

export const lessonApi = {
  list: () => apiFetch("/lecciones"),
  detail: (id) => apiFetch(`/lecciones/${id}`),
  evaluate: (id, payload) => apiFetch(`/lecciones/${id}/evaluar`, { method: "POST", body: JSON.stringify(payload) }),
};

export const progressApi = {
  list: (userId) => apiFetch(`/progreso/${userId}`),
  save: (payload) => apiFetch("/progreso", { method: "POST", body: JSON.stringify(payload) }),
  achievements: (userId) => apiFetch(`/progreso/${userId}/logros`),
};

export const dashboardApi = {
  stats: (userId) => apiFetch(`/dashboard/${userId}`),
  ranking: () => apiFetch("/ranking"),
};

export const dictionaryApi = {
  search: (q) => apiFetch(`/diccionario?q=${encodeURIComponent(q ?? "")}`),
};

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("mf-user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem("mf-user");
    localStorage.removeItem("mf-authed");
    return;
  }
  localStorage.setItem("mf-user", JSON.stringify(user));
  localStorage.setItem("mf-authed", "1"); // compat
}

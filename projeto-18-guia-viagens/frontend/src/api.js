const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Erro no pedido");
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),

  getDestinations: () => request("/destinations"),
  getDestination: (id) => request(`/destinations/${id}`),
  createDestination: (body) =>
    request("/destinations", { method: "POST", body: JSON.stringify(body) }),
  updateDestination: (id, body) =>
    request(`/destinations/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: "DELETE" }),

  getExperiences: (destId) => request(`/experiences/destination/${destId}`),
  createExperience: (destId, body) =>
    request(`/experiences/destination/${destId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteExperience: (id) => request(`/experiences/${id}`, { method: "DELETE" }),

  getPhotos: (destId) => request(`/photos/destination/${destId}`),
  uploadPhotos: (destId, files) => {
    const form = new FormData();
    files.forEach((f) => form.append("photos", f));
    return request(`/photos/destination/${destId}`, { method: "POST", body: form });
  },
  deletePhoto: (id) => request(`/photos/${id}`, { method: "DELETE" }),

  getFeed: () => request("/feed"),
  getFeedItem: (id) => request(`/feed/${id}`),
  getStats: () => request("/stats"),
};

function getApiHost() {
  const base = API_BASE.replace(/\/$/, "");
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return base.replace(/\/api$/, "");
  }
  return base.replace(/\/api$/, "") || "";
}

export function photoUrl(filename) {
  return `${getApiHost()}/uploads/${filename}`;
}

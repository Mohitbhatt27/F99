const BASE_URL = import.meta.env.VITE_BASE_URL;

async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

async function apiUpload(endpoint, formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, "GET"),
  post: (endpoint, body) => apiRequest(endpoint, "POST", body),
  patch: (endpoint, body) => apiRequest(endpoint, "PATCH", body), // ← add this
  put: (endpoint, body) => apiRequest(endpoint, "PUT", body),
  delete: (endpoint) => apiRequest(endpoint, "DELETE"),
  upload: (endpoint, formData) => apiUpload(endpoint, formData),
};

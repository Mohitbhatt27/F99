const BASE_URL = "https://connectusonfitness.onrender.com/api";

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

  return data.data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, "GET"),
  post: (endpoint, body) => apiRequest(endpoint, "POST", body),
  put: (endpoint, body) => apiRequest(endpoint, "PUT", body),
  delete: (endpoint) => apiRequest(endpoint, "DELETE"),
};

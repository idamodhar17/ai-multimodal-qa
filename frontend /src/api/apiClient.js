import { triggerLogout } from "./authBridge";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function apiClient(
  url,
  { method = "GET", body, token, headers = {} } = {}
) {
  const finalHeaders = {
    "x-api-key": API_KEY,
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body:
      body instanceof FormData
        ? body
        : body
        ? JSON.stringify(body)
        : null,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    triggerLogout();
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(data.detail || data.error || "Request failed");
  }

  return data;
}

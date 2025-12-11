// src/lib/api.ts

// Load backend API URL from environment (Vite)
const API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080";

/**
 * Generic API request helper
 * Wraps fetch() with proper JSON parsing and error handling.
 */
export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API request failed: ${res.status} ${res.statusText} — ${
        text || "No response body"
      }`
    );
  }

  // No JSON body (204)
  if (res.status === 204) return null;

  return res.json();
}

/**
 * Attach authorization header automatically
 */
export function authorizedRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  return apiRequest(path, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
}

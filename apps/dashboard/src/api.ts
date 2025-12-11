// src/api.ts

const API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080";

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
      `API request failed: ${res.status} ${res.statusText} - ${
        text || "No body"
      }`
    );
  }

  return res.json();
}

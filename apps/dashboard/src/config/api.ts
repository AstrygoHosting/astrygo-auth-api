// src/config/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined. Check your .env files.");
}

/**
 * Generic API request helper.
 * - Automatically prefixes the path with API_BASE_URL
 * - Sends/receives JSON by default
 * - Throws a structured error if response is not OK
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("Content-Type") || "";
  let body: any = null;

  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    throw {
      status: response.status,
      body,
    };
  }

  return body as T;
}

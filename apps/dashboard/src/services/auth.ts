// src/services/auth.ts

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed with status ${res.status}`);
  }

  const data = (await res.json()) as LoginResponse;

  // Store tokens in localStorage (temporary simple solution)
  localStorage.setItem("accessToken", data.tokens.accessToken);
  localStorage.setItem("refreshToken", data.tokens.refreshToken);

  return data;
}

export async function getMe() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${AUTH_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`getMe failed with status ${res.status}`);
  }

  return res.json();
}

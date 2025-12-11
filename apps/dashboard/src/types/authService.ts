// src/types/authService.ts

import { apiRequest, authorizedRequest } from "../lib/api";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Login using Astrygo Auth API
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Store tokens for later API calls
  if (res.tokens?.accessToken) {
    localStorage.setItem("accessToken", res.tokens.accessToken);
  }
  if (res.tokens?.refreshToken) {
    localStorage.setItem("refreshToken", res.tokens.refreshToken);
  }

  // Store basic user info
  if (res.user) {
    localStorage.setItem("currentUser", JSON.stringify(res.user));
  }

  return res;
}

/**
 * Fetch logged-in user info using /auth/me
 */
export async function getMe(): Promise<AuthUser> {
  const res = await authorizedRequest("/auth/me", {
    method: "GET",
  });

  return res.user;
}

/**
 * Refresh expired JWT
 */
export async function refreshToken() {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token stored");

  const res = await apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (res.tokens?.accessToken) {
    localStorage.setItem("accessToken", res.tokens.accessToken);
  }

  if (res.tokens?.refreshToken) {
    localStorage.setItem("refreshToken", res.tokens.refreshToken);
  }

  if (res.user) {
    localStorage.setItem("currentUser", JSON.stringify(res.user));
  }

  return res;
}

// src/services/authService.ts
import { apiRequest } from "../config/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  email?: string;
  message?: string;
  token?: string; // future use for JWT
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response;
}

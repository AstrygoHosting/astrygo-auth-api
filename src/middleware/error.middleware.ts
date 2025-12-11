import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Auth API Error:", err);

  if (err.message === "EMAIL_TAKEN") {
    return res.status(400).json({ error: "EMAIL_TAKEN" });
  }

  if (err.message === "INVALID_CREDENTIALS") {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }

  if (err.message === "INVALID_REFRESH_TOKEN") {
    return res.status(401).json({ error: "INVALID_REFRESH_TOKEN" });
  }

  if (err.message === "REFRESH_TOKEN_REVOKED") {
    return res.status(401).json({ error: "REFRESH_TOKEN_REVOKED" });
  }

  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}

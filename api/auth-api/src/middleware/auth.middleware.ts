import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

type AllowedRole = UserRole | "ANY";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iss: string;
  aud: string;
  jti: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(requiredRole: AllowedRole = "ANY") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error: any = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }

      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_ACCESS_SECRET;

      if (!secret) {
        const error: any = new Error("Server misconfigured: missing JWT_ACCESS_SECRET");
        error.status = 500;
        throw error;
      }

      let payload: AccessTokenPayload;

      try {
        payload = jwt.verify(token, secret) as AccessTokenPayload;
      } catch (jwtError: any) {
        const error: any = new Error("Invalid or expired access token");
        error.status = 401;
        throw error;
      }

      // Validate issuer and audience
      if (payload.iss !== "astrygo-auth-service") {
        const error: any = new Error("Invalid token issuer");
        error.status = 401;
        throw error;
      }

      if (payload.aud !== "astrygo-client") {
        const error: any = new Error("Invalid token audience");
        error.status = 401;
        throw error;
      }

      // Attach user to request
      (req as any).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      // Role check
      if (requiredRole !== "ANY" && payload.role !== requiredRole) {
        const error: any = new Error("Forbidden");
        error.status = 403;
        throw error;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

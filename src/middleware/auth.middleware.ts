import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(requiredRole: string = "ANY") {
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

      const payload: any = jwt.verify(token, secret);

      (req as any).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

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

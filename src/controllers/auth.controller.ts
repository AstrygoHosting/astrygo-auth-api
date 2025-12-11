import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import { cleanupExpiredSessions } from "../services/auth.service";

export class AuthController {
  /**
   * Register
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        const error: any = new Error("Email and password are required");
        error.status = 400;
        throw error;
      }

      const result = await AuthService.registerUser({
        email,
        password,
        name,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip,
      });

      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const error: any = new Error("Email and password are required");
        error.status = 400;
        throw error;
      }

      const result = await AuthService.loginUser({
        email,
        password,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.ip,
      });

      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Me
   */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        const error: any = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }

      const result = await AuthService.getCurrentUser(userId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh token
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const error: any = new Error("Refresh token is required");
        error.status = 400;
        throw error;
      }

      const result = await AuthService.refreshTokens(refreshToken);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout from all sessions
   */
  static async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        const error: any = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }

      await AuthService.logoutAllSessions(userId);
      return res.json({ message: "Logged out from all sessions" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout from a single session using refreshToken
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const error: any = new Error("Refresh token is required");
        error.status = 400;
        throw error;
      }

      await AuthService.logoutFromSession(refreshToken);
      return res.json({ message: "Logged out" });
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Internal cleanup handler
 * For DEV use (no auth check)
 */
export async function cleanupSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await cleanupExpiredSessions();
    return res.json({
      message: "Expired/revoked sessions cleaned up",
      deleted,
    });
  } catch (err) {
    next(err);
  }
}

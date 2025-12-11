import { Router } from "express";
import {
  AuthController,
  cleanupSessionsHandler,
} from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
  refreshRateLimiter,
} from "../middleware/rateLimit";

const router = Router();

/**
 * AUTH ROUTES
 */

// Register (with rate limit)
router.post("/register", registerRateLimiter, AuthController.register);

// Login (with rate limit)
router.post("/login", loginRateLimiter, AuthController.login);

// Current user (requires any authenticated user)
router.get("/me", authMiddleware("ANY"), AuthController.me);

// Refresh tokens (with rate limit)
router.post("/refresh", refreshRateLimiter, AuthController.refresh);

// Logout from all sessions (requires auth)
router.post("/logout-all", authMiddleware("ANY"), AuthController.logoutAll);

// Logout from a single session (uses refreshToken in body)
router.post("/logout", AuthController.logout);

/**
 * INTERNAL / DEVOPS ROUTES
 * Protected by x-cron-key header (CRON_CLEANUP_KEY)
 */
router.post("/internal/cleanup-sessions", cleanupSessionsHandler);

export default router;

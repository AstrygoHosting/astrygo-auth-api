import { prisma } from "../prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Generate a hash for refresh tokens
 */
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Register new user
 */
export async function registerUser({
  email,
  password,
  name,
  userAgent,
  ipAddress,
}: {
  email: string;
  password: string;
  name?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error: any = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  // Create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      ipAddress,
      userAgent,
    },
  });

  // Generate tokens
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    sessionId: session.id,
  });

  // Save hashed refreshToken
  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: hashToken(refreshToken) },
  });

  return { user, tokens: { accessToken, refreshToken } };
}

/**
 * Login user
 */
export async function loginUser({
  email,
  password,
  userAgent,
  ipAddress,
}: {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error: any = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error: any = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      ipAddress,
      userAgent,
    },
  });

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    sessionId: session.id,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: hashToken(refreshToken) },
  });

  return { user, tokens: { accessToken, refreshToken } };
}

/**
 * Refresh tokens (Rotation)
 */
export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const hashed = hashToken(refreshToken);

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (!session) {
    const error: any = new Error("Invalid refresh token (session not found)");
    error.status = 401;
    throw error;
  }

  if (session.revokedAt || session.expiresAt < new Date()) {
    const error: any = new Error("Session expired or revoked");
    error.status = 401;
    throw error;
  }

  // Check hash match
  if (session.refreshTokenHash !== hashed) {
    // rotate protection → revoke session
    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const error: any = new Error("Refresh token reuse detected");
    error.status = 401;
    throw error;
  }

  const user = session.user;

  // Create new tokens
  const newAccessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken({
    sub: user.id,
    sessionId: session.id,
  });

  // Update session hash
  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: hashToken(newRefreshToken) },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Get current user data
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    const error: any = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
}

/**
 * Logout this session
 */
export async function logoutFromSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  await prisma.session.update({
    where: { id: payload.sessionId },
    data: { revokedAt: new Date() },
  });

  return true;
}

/**
 * Logout all sessions
 */
export async function logoutAllSessions(userId: string) {
  await prisma.session.updateMany({
    where: { userId },
    data: { revokedAt: new Date() },
  });

  return true;
}

/**
 * Cleanup expired and revoked sessions
 */
export async function cleanupExpiredSessions(limit = 500) {
  const now = new Date();

  const { count } = await prisma.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        { revokedAt: { not: null } },
      ],
    },
  });

  return count;
}

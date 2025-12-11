import jwt from "jsonwebtoken";
import crypto from "crypto";

interface BasePayload {
  sub: string;       // userId
  sessionId?: string;
  email?: string;
  role?: string;
  iss: string;       // issuer
  aud: string;       // audience
  jti: string;       // unique token ID (for replay protection)
}

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";

// Helper to generate unique IDs
function generateJTI() {
  return crypto.randomBytes(16).toString("hex");
}

// ---------------------------
//   ACCESS TOKEN
// ---------------------------
export function signAccessToken(payload: {
  sub: string;
  email: string;
  role: string;
}) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing JWT_ACCESS_SECRET");

  const fullPayload: BasePayload = {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    iss: "astrygo-auth-service",
    aud: "astrygo-client",
    jti: generateJTI(),
  };

  return jwt.sign(fullPayload, secret, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing JWT_ACCESS_SECRET");

  return jwt.verify(token, secret);
}

// ---------------------------
//   REFRESH TOKEN
// ---------------------------
export function signRefreshToken(payload: {
  sub: string;
  sessionId: string;
}) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("Missing JWT_REFRESH_SECRET");

  const fullPayload: BasePayload = {
    sub: payload.sub,
    sessionId: payload.sessionId,
    iss: "astrygo-auth-service",
    aud: "astrygo-refresh",
    jti: generateJTI(),
  };

  return jwt.sign(fullPayload, secret, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

export function verifyRefreshToken(token: string) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("Missing JWT_REFRESH_SECRET");

  return jwt.verify(token, secret) as BasePayload;
}

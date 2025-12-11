import { User, UserRole } from '@prisma/client';
import { prisma } from '../db/prisma';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || 'dev-access-secret-enterprise';
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-enterprise';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export interface AccessTokenPayload {
  sub: string;   // userId
  email: string;
  role: UserRole;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;     // userId
  sessionId: string;
  type: 'refresh';
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  // إنشاء Access + Refresh Tokens + Session
  static async generateTokensForUser(user: User): Promise<GeneratedTokens> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

const accessToken = (jwt as any).sign(accessPayload, ACCESS_TOKEN_SECRET, {
  expiresIn: ACCESS_TOKEN_EXPIRES_IN,
}) as string;


    const refreshExpiresAt = this.getRefreshTokenExpiryDate();

    const session = await (prisma as any).session.create({
      data: {
        userId: user.id,
        refreshToken: '',
        expiresAt: refreshExpiresAt,
      },
    });

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      sessionId: session.id,
      type: 'refresh',
    };

const refreshToken = (jwt as any).sign(
  refreshPayload,
  REFRESH_TOKEN_SECRET,
  {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  }
) as string;


    await (prisma as any).session.update({
      where: { id: session.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  // verify access token
  static verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  }

  // rotate refresh token
  static async rotateRefreshToken(refreshTokenJwt: string): Promise<{
    user: User;
    tokens: GeneratedTokens;
  }> {
    let decoded: RefreshTokenPayload;

    try {
      decoded = jwt.verify(
        refreshTokenJwt,
        REFRESH_TOKEN_SECRET
      ) as RefreshTokenPayload;
    } catch {
      throw new Error('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh' || !decoded.sessionId) {
      throw new Error('Invalid token type');
    }

    const session = await (prisma as any).session.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true },
    });

    if (!session || !session.user) {
      throw new Error('Refresh session not found');
    }

    if (session.expiresAt < new Date()) {
      await (prisma as any).session.delete({ where: { id: session.id } });
      throw new Error('Refresh token expired');
    }

    if (session.refreshToken !== refreshTokenJwt) {
      throw new Error('Refresh token does not match stored session');
    }

    const user = session.user;

    await (prisma as any).session.delete({ where: { id: session.id } });

    const tokens = await TokenService.generateTokensForUser(user);

    return { user, tokens };
  }

  static async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    await (prisma as any).session.deleteMany({
      where: { userId },
    });
  }

  private static getRefreshTokenExpiryDate(): Date {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    return now;
  }
}

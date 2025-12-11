// src/config/env.ts

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  // Cloud Run يمرّر PORT تلقائيًا (مثلاً 8080)
  // محليًا: لو مافي PORT في env → نستخدم 4002
  port: Number(process.env.PORT || 4002),

  nodeEnv: process.env.NODE_ENV || 'development',

  databaseUrl: required('DATABASE_URL'),

  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

// src/config/roles.ts

// نفس القيم الموجودة في Prisma enum UserRole
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  CLIENT = 'CLIENT',
}

// أدوار إدارية (تقدر تدخل لوحة الإدارة كاملة)
export const AdminRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

// Scopes للخدمات (Service Accounts)
// نستخدمها في Service Tokens و Middleware
export const ServiceScopes = {
  AUTH_SERVICE: 'auth:service',
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write',
  HOSTING_READ: 'hosting:read',
  HOSTING_WRITE: 'hosting:write',
} as const;

// نوع TypeScript يمثل قيمة واحدة من ServiceScopes
export type ServiceScope = (typeof ServiceScopes)[keyof typeof ServiceScopes];

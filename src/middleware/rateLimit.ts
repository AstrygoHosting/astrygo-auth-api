import rateLimit from "express-rate-limit";

// 🔐 limiter لمحاولات تسجيل الدخول
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // أقصى 10 محاولات لكل IP في الـ window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts, please try again later.",
  },
});

// 📝 limiter للتسجيل (register)
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 دقيقة
  max: 5, // أقصى 5 تسجيلات لكل IP في الساعة
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many registration attempts, please try again later.",
  },
});

// ♻️ limiter للـ refresh
export const refreshRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقيقة
  max: 30, // أقصى 30 refresh لكل IP في الدقيقة
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many token refresh attempts, please slow down.",
  },
});

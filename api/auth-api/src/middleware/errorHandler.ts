import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[ERROR]", err);

  // لو عنده status code، استخدمه. غير كدا 500.
  const status = err.status || 500;

  // لو عنده message واضحة، استخدمها. غير كدا general message.
  const message =
    err.message || "An unexpected error occurred. Please try again later.";

  return res.status(status).json({
    status: "error",
    message,
  });
}

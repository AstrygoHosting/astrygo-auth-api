import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

// دالة لإنشاء الـ app — كما يتوقعها server.ts
export function createApp(): Application {
  const app = express();

  app.use(express.json());

  // Routes
  app.use("/auth", authRoutes);

  // آخر middleware: Global error handler
  app.use(errorHandler);

  return app;
}

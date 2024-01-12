import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import organizationRoutes from "./modules/organization/organization.routes";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ALLOW_ORIGINS?.split(","),
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);

app.use(async (req, res, next) => {
  next(createError(404, "Not found"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const code = err.status || 500;
  const status = err.message || "Internal server error";
  const errors = err.cause;

  res.status(code).json({
    code,
    status,
    errors,
  });
});

export default app;

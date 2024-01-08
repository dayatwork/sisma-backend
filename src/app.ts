import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

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
  })
);
app.use(cookieParser());

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

// LOGIN
// app.post("/login", async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user || !user.password) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   const jwtPayload = {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//   };
//   const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

//   return res.json({
//     message: "You are logged in!",
//     data: {
//       accessToken,
//     },
//   });
// });

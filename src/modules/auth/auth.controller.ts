import { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../user/user.service";
import { comparePassword, hashPassword } from "../../lib/password";
import { generateAccessToken } from "../../lib/tokens";
import { LoginInput, SignupInput } from "./auth.schema";
import prisma from "../../lib/prisma";

export const loginController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);

  return res.json({
    message: "You are logged in!",
    data: {
      accessToken,
    },
  });
};

export const signupController = async (
  req: Request<{}, {}, SignupInput>,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, role } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      isActive: true,
      name,
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
  });
  const { password: _, ...data } = user;

  return res.json({
    message: "Account registered successfully",
    data,
  });
};

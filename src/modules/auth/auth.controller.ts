import { NextFunction, Request, Response } from "express";
import { getUserByEmail, getUserById } from "../user/user.service";
import { comparePassword, hashPassword } from "../../lib/password";
import { generateAccessToken } from "../../lib/tokens";
import { LoginInput, SignupInput } from "./auth.schema";
import prisma from "../../lib/prisma";
import { AccessTokenPayload } from "../../middlewares/auth";

export const loginController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.json({
      message: "You are logged in!",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const signupController = async (
  req: Request<{}, {}, SignupInput>,
  res: Response,
  next: NextFunction
) => {
  try {
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
        role,
        password: hashedPassword,
      },
    });
    const { password: _, ...data } = user;

    return res.json({
      message: "Account registered successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getLoggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userFromToken = res.locals.user as AccessTokenPayload;

    const user = await getUserById(userFromToken.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...data } = user;

    return res.json({ message: "Success", data });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

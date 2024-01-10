import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export type AccessTokenPayload = {
  id: string;
  name: string;
  email: string;
  organizationId: string | null;
  role: Role;
};

export const ensureLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (
    (!authorization || !authorization.startsWith("Bearer")) &&
    !req.cookies["accessToken"]
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken =
    req.cookies["accessToken"] || authorization?.split(" ")[1];

  try {
    const jwtDecode = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as AccessTokenPayload;

    res.locals.user = jwtDecode;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

export const ensureUserRole =
  (allowRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = authorization.split(" ")[1];

    try {
      const jwtDecode = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as AccessTokenPayload;
      if (!allowRoles.includes(jwtDecode.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.locals.user = jwtDecode;
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  };

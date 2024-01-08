import { NextFunction, Request, Response } from "express";
import {
  getUserById,
  getUsers,
  registerOrganizationUser,
} from "./user.service";
import { RegisterOrganizationUserInput } from "./user.schema";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    return res.status(201).json({ message: "Success", data: users });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    return res.status(201).json({ message: "Success", data: user });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export const registerOrganizationUserController = async (
  req: Request<{}, {}, RegisterOrganizationUserInput>,
  res: Response,
  next: NextFunction
) => {
  const { email, name, organizationId, role } = req.body;

  try {
    const user = await registerOrganizationUser({
      email,
      name,
      organizationId,
      role,
    });
    if (!user) {
      throw new Error("Failed to create user");
    }
    const { password, ...data } = user;
    return res.status(201).json({ message: "User created", data });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};
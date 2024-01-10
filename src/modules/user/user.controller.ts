import { NextFunction, Request, Response } from "express";
import {
  changePassword,
  getUserById,
  getUsers,
  registerOrganizationUser,
} from "./user.service";
import {
  ChangePasswordInput,
  RegisterOrganizationUserInput,
} from "./user.schema";
import { AccessTokenPayload } from "../../middlewares/auth";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("user", res.locals.user);
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

export const changePasswordController = async (
  req: Request<{}, {}, ChangePasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, oldPassword } = req.body;
  const user = res.locals.user as AccessTokenPayload;

  try {
    await changePassword({ id: user.id, newPassword, oldPassword });

    return res.status(200).json({ message: "Password changed!" });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

import { NextFunction, Request, Response } from "express";
import { CreateOrganizationInput } from "./organization.schema";
import {
  createOrganization,
  getOrganizationById,
  getOrganizations,
} from "./organization.service";

export const getOrganizationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await getOrganizations();
    return res.status(201).json({ message: "Success", data: organizations });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export const getOrganizationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const organization = await getOrganizationById(id);
    return res.status(201).json({ message: "Success", data: organization });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export const createOrganizationController = async (
  req: Request<{}, {}, CreateOrganizationInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await createOrganization(req.body);
    if (!organization) {
      throw new Error("Failed to create organization");
    }
    return res
      .status(201)
      .json({ message: "Organization created", data: organization });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

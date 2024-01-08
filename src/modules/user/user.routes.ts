import express from "express";

import { validate } from "../../middlewares/validate";
import { ensureUserRole } from "../../middlewares/auth";
import { registerOrganizationUserSchema } from "./user.schema";
import { registerOrganizationUserController } from "./user.controller";

const router = express.Router();

router.post(
  "/register",
  validate(registerOrganizationUserSchema),
  ensureUserRole(["ORGANIZATION_ADMIN"]),
  registerOrganizationUserController
);

export default router;

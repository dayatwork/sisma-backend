import express from "express";

import { validate } from "../../middlewares/validate";
import { ensureLoggedIn, ensureUserRole } from "../../middlewares/auth";
import { registerOrganizationUserSchema } from "./user.schema";
import {
  getUserByIdController,
  getUsersController,
  registerOrganizationUserController,
} from "./user.controller";

const router = express.Router();

router.post(
  "/register",
  validate(registerOrganizationUserSchema),
  ensureUserRole(["ORGANIZATION_ADMIN"]),
  registerOrganizationUserController
);
router.get("/", ensureLoggedIn, getUsersController);
router.get("/:id", ensureLoggedIn, getUserByIdController);

export default router;

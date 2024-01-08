import express from "express";

import { validate } from "../../middlewares/validate";
import { ensureLoggedIn, ensureUserRole } from "../../middlewares/auth";
import { createOrganizationSchema } from "./organization.schema";
import {
  createOrganizationController,
  getOrganizationByIdController,
  getOrganizationsController,
} from "./organization.controller";

const router = express.Router();

router.post(
  "/",
  validate(createOrganizationSchema),
  ensureUserRole(["SUPER_ADMIN", "ADMIN"]),
  createOrganizationController
);
router.get("/", ensureLoggedIn, getOrganizationsController);
router.get("/:id", ensureLoggedIn, getOrganizationByIdController);

export default router;

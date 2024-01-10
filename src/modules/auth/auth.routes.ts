import express from "express";

import { validate } from "../../middlewares/validate";
import { loginSchema, signupSchema } from "./auth.schema";
import {
  getLoggedInUser,
  loginController,
  signupController,
} from "./auth.controller";
import { ensureLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.post("/login", validate(loginSchema), loginController);
router.post("/signup", validate(signupSchema), signupController);
router.get("/me", ensureLoggedIn, getLoggedInUser);

export default router;

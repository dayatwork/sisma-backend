import express from "express";

import { validate } from "../../middlewares/validate";
import { loginSchema, signupSchema } from "./auth.schema";
import { loginController, signupController } from "./auth.controller";

const router = express.Router();

router.post("/login", validate(loginSchema), loginController);
router.post("/signup", validate(signupSchema), signupController);

export default router;

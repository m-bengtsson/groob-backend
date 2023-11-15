import express from "express";
import { validateLogin, validateSignup } from "../middleware/validate.js";
import { isAdmin } from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import {
  inviteUser,
  requestResetPassword,
  changePassword,
  registerUser,
  loginUser,
  refresh,
  logoutUser,
} from "../controllers/identity.controller.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/invite", [authenticate, isAdmin], inviteUser);

router.post("/requestResetPassword", requestResetPassword);

router.patch("/changePassword", changePassword);

router.post("/register", validateSignup, registerUser);

router.post("/login", [loginLimiter, validateLogin], loginUser);

router.post("/logout", logoutUser);

router.post("/refresh", refresh);

export default router;

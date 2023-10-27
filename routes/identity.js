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

const router = express.Router();

router.post("/invite", [authenticate, isAdmin], inviteUser);

router.post("/requestResetPassword", requestResetPassword);

router.patch("/changePassword", changePassword);

router.post("/register", validateSignup, registerUser);

router.post("/login", validateLogin, loginUser);

router.post("/logout", authenticate, logoutUser);

router.post("/refresh", refresh);

export default router;

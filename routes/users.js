import express from "express";
import authenticate from "../middleware/authenticate.js";
import { isAdmin } from "../middleware/authorize.js";
import {
	getAllUsers,
	getCurrentUser,
	getUserById,
	updateUser,
	deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", isAdmin, getAllUsers);

router.get("/currentUser", getCurrentUser);

router.get("/:id", isAdmin, getUserById);

router.patch("/:id", isAdmin, updateUser);

router.delete("/:id", isAdmin, deleteUser);

export default router;

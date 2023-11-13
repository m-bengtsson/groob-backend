import express from "express";
import authenticate from "../middleware/authenticate.js";
import { isAdmin } from "../middleware/authorize.js";
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/public", getAllItems);

router.use(authenticate);

router.get("/", getAllItems);

router.get("/:id", getItem);

router.post("/", isAdmin, createItem);

router.patch("/:id", isAdmin, updateItem);

router.delete("/:id", isAdmin, deleteItem);

export default router;

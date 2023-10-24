import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
	getItems,
	getItem,
	createItem,
	deleteItem,
} from "../controllers/item.controllers.js";
import { isAdmin } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
	const items = await getItems();
	res.send(items);
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const item = await getItem(id);
	res.send(item);
});

router.post("/", isAdmin, async (req, res) => {
	const { title, body, created_by, number_of_items } = req.body;
	const created = await createItem(title, body, created_by, number_of_items);

	res.status(201).send(created);
});

router.delete("/:id", isAdmin, async (req, res) => {
	const id = req.params.id;
	const item = await deleteItem(id);

	//result.affectedRows will be 0 if item is not found
	if (item === 0) {
		res.sendStatus(400);
	}

	res.sendStatus(200);
});

export default router;

import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
	getItems,
	getItem,
	createItem,
	deleteItem,
	updateItem,
} from "../controllers/item.controllers.js";
import { isAdmin } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
	const items = await getItems();
	if (!items) {
		return res.status(500).send("Something went wrong, try again later");
	}
	res.send(items);
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const item = await getItem(id);
	if (!item) {
		return res.status(400).send("Could not find that item");
	}
	res.send(item);
});

router.post("/", isAdmin, async (req, res) => {
	const { title, description, createdBy, numberOfItems } = req.body;

	if (!title || !description || !createdBy || !numberOfItems) {
		return res.status(400).send("All fields required");
	}

	try {
		const created = await createItem(
			title,
			description,
			numberOfItems,
			createdBy
		);
		res.status(201).send(created);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
});

router.patch("/:id", isAdmin, async (req, res) => {
	const id = req.params.id;
	const updated = await updateItem(req.body, id);
	try {
		if (updated === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.status(201).send(updated);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
});

router.delete("/:id", isAdmin, async (req, res) => {
	const id = req.params.id;
	const item = await deleteItem(id);

	try {
		//result.affectedRows will be 0 if item is not found
		if (item === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.sendStatus(200);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
});

export default router;

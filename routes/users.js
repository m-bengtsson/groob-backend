import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/user.controllers.js";
import { isAdmin } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
	const users = await getUsers();
	res.send(users);
});

router.get("/currentUser", async (req, res) => {
	const id = req.user.id;
	const user = await getUser(id);
	res.send(user);
});

router.get("/:id", isAdmin, async (req, res) => {
	const id = req.params.id;
	const user = await getUser(id);
	res.send(user);
});

router.post("/", isAdmin, async (req, res) => {
	const created = await createUser(req.body);

	res.status(201).send(created);
});

router.patch("/:id", isAdmin, async (req, res) => {
	const id = req.params.id;
	const updated = await updateUser(req.body, id);

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
	const destroyed = await deleteUser(req.params.id);

	res.status(200).send({ message: destroyed });
});

export default router;

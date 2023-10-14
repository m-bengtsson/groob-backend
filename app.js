import express from "express";
import {
	getItems,
	getItem,
	createItem,
	deleteItem,
	getUsers,
} from "./database.js";

const app = express();

app.use(express.json());

app.get("/items", async (req, res) => {
	const items = await getItems();
	res.send(items);
});

app.get("/items/:id", async (req, res) => {
	const id = req.params.id;
	const item = await getItem(id);
	res.send(item);
});

app.post("/items", async (req, res) => {
	console.log("BODY", req.body);
	const { title, body, created_by, number_of_items } = req.body;
	const created = await createItem(title, body, created_by, number_of_items);

	res.status(201).send(created);
});

app.delete("/items/:id", async (req, res) => {
	const id = req.params.id;
	const item = await deleteItem(id);

	//result.affectedRows will be 0 if item is not found
	if (item === 0) {
		res.sendStatus(400);
	}

	res.sendStatus(200);
});

app.get("/users", async (req, res) => {
	const users = await getUsers();
	res.send(users);
});

app.listen(8080, () => {
	console.log("Server running on port 8080");
});

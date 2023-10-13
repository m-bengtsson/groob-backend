import express from "express";
import { getItems, getItem, createItem } from "./database.js";

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
	const { title, body, created_by } = req.body;
	const created = await createItem(title, body, created_by);

	res.status(201).send(created);
});

app.listen(8080, () => {
	console.log("Server running on port 8080");
});

import {
	useGetItems,
	useGetItem,
	useCreateItem,
	useUpdateItem,
	useDeleteItem,
} from "../hooks/useItem.js";

export const getAllItems = async (req, res) => {
	const items = await useGetItems();
	if (!items) {
		return res.status(500).send("Something went wrong, try again later");
	}
	res.send(items);
};

export const getItem = async (req, res) => {
	const id = req.params.id;
	const item = await useGetItem(id);
	if (!item) {
		return res.status(400).send("Could not find that item");
	}
	res.send(item);
};

export const createItem = async (req, res) => {
	const { title, description, createdBy, numberOfItems } = req.body;

	console.log("REQ BODY: ", title, description, createdBy, numberOfItems);

	if (!title || !description || !createdBy || !numberOfItems) {
		return res.status(400).send("All fields required");
	}

	try {
		const created = await useCreateItem({
			title,
			description,
			numberOfItems,
			createdBy,
		});

		res.status(201).send(created);
	} catch (error) {
		console.log("ERROR", error);
		res.status(400).send("Something went wrong, try again later");
	}
};

export const updateItem = async (req, res) => {
	const id = req.params.id;
	const updated = await useUpdateItem(req.body, id);
	try {
		if (updated === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.status(201).send(updated);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

export const deleteItem = async (req, res) => {
	const id = req.params.id;
	const item = await useDeleteItem(id);

	try {
		//result.affectedRows will be 0 if item is not found
		if (item === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.sendStatus(200);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

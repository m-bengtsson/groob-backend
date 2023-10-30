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
	res.status(200).send(items);
};

export const getItem = async (req, res) => {
	const id = req.params.id;
	const item = await useGetItem(id);

	if (!item) {
		return res.status(400).send("Could not find that item");
	}
	res.status(200).send(item);
};

export const createItem = async (req, res) => {
	const { title, description, createdBy, numberOfItems } = req.body;

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
		res.status(400).send("Something went wrong, try again later");
	}
};

export const updateItem = async (req, res) => {
	const id = req.params.id;
	const updated = await useUpdateItem(req.body, id);
	try {
		if (updated[0] === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		const updatedItem = await useGetItem(id);

		res.status(201).send(updatedItem);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

export const deleteItem = async (req, res) => {
	const id = req.params.id;
	const item = await useDeleteItem(id);
	try {
		if (item === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.sendStatus(200);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

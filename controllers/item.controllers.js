import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

const Item = db.item;

export const getItems = async () => {
	const foundItems = await Item.findAll();
	return foundItems;
};

export const getItem = async (id) => {
	const foundItem = await Item.findOne({ where: { id } });
	return foundItem;
};

export const createItem = async ({
	title,
	description,
	numberOfItems,
	createdBy,
}) => {
	try {
		const createdItem = await Item.create({
			id: uuidv4(),
			title,
			description,
			numberOfItems,
			createdBy,
		});
		return createdItem;
	} catch (error) {
		return error;
	}
};

export const updateItem = async (newValue, id) => {
	const updatedItem = Object.entries(newValue).map(
		async ([key, value]) =>
			await Item.update(
				{ [key]: value },
				{
					where: {
						id: id,
					},
				}
			)
	);

	await Promise.all(updatedItem);
	const isUpdated = await Item.update(
		{ updatedBy: 12 },
		{
			where: {
				id,
			},
		}
	);
	return isUpdated;
};

export const deleteItem = async (id) => {
	return await Item.destroy({ where: { id } });
};

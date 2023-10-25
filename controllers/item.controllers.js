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
	const createdItem = await Item.create({
		id: uuidv4(),
		title,
		description,
		numberOfItems,
		createdBy,
	});
	return createdItem;
};

export const updateItem = async (newValue, id) => {
	const updatedItem = await Item.update({ ...newValue }, { where: { id } });

	return updatedItem;
};

export const deleteItem = async (id) => {
	return await Item.destroy({ where: { id } });
};

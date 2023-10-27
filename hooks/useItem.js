import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

const Item = db.item;

export const useGetItems = async () => {
	const foundItems = await Item.findAll();
	return foundItems;
};

export const useGetItem = async (id) => {
	const foundItem = await Item.findOne({ where: { id } });
	return foundItem;
};

export const useCreateItem = async ({
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

export const useUpdateItem = async (newValue, id) => {
	const updatedItem = await Item.update({ ...newValue }, { where: { id } });

	return updatedItem;
};

export const useDeleteItem = async (id) => {
	return await Item.destroy({ where: { id } });
};

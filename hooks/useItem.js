import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

const Item = db.item;

//Op.like = case insensitive
// % allow matching anything before and after the searched query
export const useGetItems = async (publicAttributes, searchQuery) => {
  if (searchQuery && !publicAttributes) {
    const foundItems = await Item.findAll({
      where: {
        title: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
    });
    return foundItems;
  }

  if (publicAttributes && !searchQuery) {
    const foundItems = await Item.findAll({ attributes: publicAttributes });
    return foundItems;
  }

  if (publicAttributes && searchQuery) {
    const foundItems = await Item.findAll({
      attributes: publicAttributes,
      where: {
        title: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
    });
    return foundItems;
  }
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
  price,
  numberOfItems,
  createdBy,
}) => {
  const createdItem = await Item.create({
    id: uuidv4(),
    title,
    description,
    price,
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

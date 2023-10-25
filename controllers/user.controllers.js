import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const saltRounds = 10;
const User = db.user;

export const getUsers = async () => {
	const foundUsers = await User.findAll();

	return foundUsers;
};

export const getUser = async (id) => {
	const foundUser = await User.findOne({ where: { id } });
	return foundUser;
};

export const getUserByEmail = async (email) => {
	const foundUser = await User.findOne({ where: { email } });
	return foundUser;
};

export const createUser = async ({ name, email, password, createdBy }) => {
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const createdUser = await User.create({
		id: uuidv4(),
		name,
		email,
		password: hashedPassword,
		createdBy,
	});

	return createdUser;
};

export const updateUser = async (newValue, id) => {
	const updatedUser = await User.update({ ...newValue }, { where: { id } });

	return updatedUser;
};

export const deleteUser = async (id) => {
	return await User.destroy({ where: { id } });
};

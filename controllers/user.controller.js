import {
	useCreateUser,
	useDeleteUser,
	useGetUser,
	useGetUsers,
	useUpdateUser,
} from "../hooks/useUser.js";

export const getAllUsers = async (req, res) => {
	const users = await useGetUsers();
	res.send(users);
};

export const getCurrentUser = async (req, res) => {
	const id = req.user.id;
	const user = await useGetUser(id);
	res.send(user);
};

export const getUserById = async (req, res) => {
	const id = req.params.id;
	const user = await useGetUser(id);
	res.send(user);
};

export const createUser = async (req, res) => {
	const created = await useCreateUser(req.body);

	res.status(201).send(created);
};

export const updateUser = async (req, res) => {
	const id = req.params.id;
	const updated = await useUpdateUser(req.body, id);

	try {
		if (updated === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.status(201).send(updated);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

export const deleteUser = async (req, res) => {
	const destroyed = await useDeleteUser(req.params.id);

	res.status(200).send({ message: destroyed });
};

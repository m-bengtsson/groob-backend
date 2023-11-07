import {
	useCreateUser,
	useDeleteUser,
	useGetUser,
	useGetUsers,
	useUpdateUser,
} from "../hooks/useUser.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await useGetUsers();
		if (!users) {
			return res.status(500).send("Something went wrong, try again later");
		}

		res.status(200).send(users);
	} catch (error) {
		return res.status(500).send("Something went wrong, try again later");
	}
};

export const getCurrentUser = async (req, res) => {
	const id = req.user.id;
	try {
		const user = await useGetUser(id);

		if (!user) {
			return res.status(500).send("Something went wrong, try again later");
		}

		res.status(200).send(user);
	} catch (error) {
		return res.status(500).send("Something went wrong, try again later");
	}
};

export const getUserById = async (req, res) => {
	const id = req.params.id;
	try {
		const user = await useGetUser(id);

		if (!user) {
			return res.status(400).send("Could not find that user");
		}

		res.status(200).send(user);
	} catch (error) {
		return res.status(500).send("Something went wrong, try again later");
	}
};

export const updateUser = async (req, res) => {
	const id = req.params.id;
	const adminId = req.user.id;
	const updated = await useUpdateUser({ ...req.body, updatedBy: adminId }, id);

	try {
		if (updated[0] === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		const updatedUser = await useGetUser(id);
		res.status(201).send(updatedUser);
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const destroyed = await useDeleteUser(id);

		if (destroyed === 0) {
			return res.status(400).send("Something went wrong, try again later");
		}

		res.status(200).send("User destroyed");
	} catch (error) {
		res.status(400).send("Something went wrong, try again later");
	}
};

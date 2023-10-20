import { getUserByEmail } from "../database-config/database.js";

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const maybeUser = await getUserByEmail(email);
	if (!maybeUser) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in");
	}

	if (maybeUser.password !== password) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in");
	}

	req.user = maybeUser;
	next();
};

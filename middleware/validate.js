import bcrypt from "bcrypt";
import { getUserByEmail } from "../controllers/user.controllers.js";

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const maybeUser = await getUserByEmail(email);
	if (!maybeUser) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in");
	}

	const match = await bcrypt.compare(password, maybeUser.password);

	if (!match) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in");
	}

	req.user = maybeUser;
	next();
};

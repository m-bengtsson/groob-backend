import bcrypt from "bcrypt";
import { getUserByEmail } from "../controllers/user.controllers.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import usePassWordValidate from "../hooks/usePasswordValidate.js";

dotenv.config();

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const maybeUser = await getUserByEmail(email);
	if (!maybeUser) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in1");
	}

	const match = await bcrypt.compare(password, maybeUser.password);

	if (!match) {
		return res.status(401).send("Neeej, vad synd, du får inte logga in2");
	}

	req.user = maybeUser;
	next();
};

export const validateSignup = async (req, res, next) => {
	const { name, password, repeatPassword } = req.body;

	const verificationToken = req.headers["authorization"];

	if (!verificationToken) {
		return res.status(400).send("Not verified");
	}

	try {
		const decoded = jwt.verify(
			verificationToken,
			process.env.SECRET_KEY_VERIFY
		);

		const maybeUser = await getUserByEmail(decoded.email);
		if (maybeUser) {
			return res
				.status(400)
				.send("Neej, vad synd, du får inte regristrera dig");
		}
		const maybeInvited = await db.invitedUser.findOne({
			where: { email: decoded.email },
		});
		if (!maybeInvited) {
			return res.status(400).send("Neej va synd du får inte registrera dig");
		}

		if (!name) {
			return res.status(400).send("All fields required");
		}

		try {
			await usePassWordValidate(password, repeatPassword);
		} catch (error) {
			return res.status(400).send(error.message);
		}

		req.invite = maybeInvited;
		next();
	} catch (error) {
		return res.status(400).send("Sorry something went wrong");
	}
};

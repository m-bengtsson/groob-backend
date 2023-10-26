import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import transporter from "../nodemailer.js";
import { validateLogin, validateSignup } from "../middleware/validate.js";
import { isAdmin } from "../middleware/authorize.js";
import authenticate from "../middleware/authenticate.js";
import db from "../models/index.js";
import {
	getUser,
	getUserByEmail,
	createUser,
	updateUser,
} from "../controllers/user.controllers.js";
import bcrypt from "bcrypt";

const router = express.Router();
dotenv.config();

const saltRounds = 10;
const secret_key_access = process.env.SECRET_KEY_ACCESS;
const secret_key_refresh = process.env.SECRET_KEY_REFRESH;
const secret_key_verify = process.env.SECRET_KEY_VERIFY;
const secret_key_reset = process.env.SECRET_KEY_RESET;
const ResetPasswordToken = db.resetPasswordToken;

router.post("/invite", [authenticate, isAdmin], async (req, res) => {
	const { email } = req.body;
	const { id } = req.user;

	const maybeUser = await getUserByEmail(email);
	if (maybeUser) {
		return res.status(400).send("Neej va syynd, emailen används redan :'(");
	}

	const maybeInvited = await db.invitedUser.findOne({ where: { email } });
	if (maybeInvited) {
		await db.invitedUser.destroy({ where: { id: maybeInvited.id } });
	}

	const verificationToken = jwt.sign({ email }, secret_key_verify, {
		expiresIn: "15m",
	});

	await db.invitedUser.create({
		id: uuidv4(),
		email,
		token: verificationToken,
		createdBy: id,
	});

	// Todo: token i url
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Email verification",
		html: '<p>Click <a href="http://localhost:5173/login">here</a> to verify your email</p>',
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error, info);
			res.status(400).send("Could not send verification email" + error);
		} else {
			res.status(200).send("Email sent: " + verificationToken);
		}
	});
});

router.post("/requestResetPassword", async (req, res) => {
	const { email } = req.body;
	const maybeUser = await getUserByEmail(email);

	if (!maybeUser) {
		return res
			.status(200)
			.send("Vi har skickat ett mail om din mailadress finns i vår databas");
	}

	const maybeReset = await ResetPasswordToken.findOne({
		where: { userId: maybeUser.id },
	});

	if (maybeReset) {
		await ResetPasswordToken.destroy({ where: { id: maybeReset.id } });
	}

	const resetPasswordToken = jwt.sign({ id: maybeUser.id }, secret_key_reset, {
		expiresIn: "15m",
	});

	await ResetPasswordToken.create({
		id: uuidv4(),
		email,
		token: resetPasswordToken,
		userId: maybeUser.id,
	});

	// Todo: token i url
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Reset password",
		html: '<p>Click <a href="http://localhost:5173/login">here</a> to reset your password</p>',
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.status(400).send("Could not send verification email" + error);
		} else {
			res.status(200).send("Email sent: " + resetPasswordToken);
		}
	});
});

router.patch("/changePassword", async (req, res) => {
	const resetPasswordToken = req.headers["authorization"];

	if (!resetPasswordToken) {
		return res.status(400).send("Not verified");
	}

	try {
		const decoded = jwt.verify(
			resetPasswordToken,
			process.env.SECRET_KEY_RESET
		);

		const maybeUser = await getUser(decoded.id);

		if (!maybeUser) {
			return res.status(400).send("Sorry something went wrong1");
		}

		const maybeRequested = await ResetPasswordToken.findOne({
			where: { userId: decoded.id },
		});
		if (!maybeRequested) {
			return res.status(400).send("Sorry something went wrong2");
		}

		const { password, repeatPassword } = req.body;

		if (!password || !repeatPassword) {
			return res.status(400).send("All fields required");
		}
		const strongPassword =
			/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if (!strongPassword.test(password)) {
			return res.status(400).send("Password is too weak");
		}

		if (password !== repeatPassword) {
			return res.status(400).send("Passwords do not match");
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const updatedUser = await updateUser(
			{ password: hashedPassword },
			maybeUser.id
		);

		res.status(200).send("Password reset" + updatedUser);
	} catch (error) {
		return res.status(400).send("Sorry something went wrong3");
	}
});

router.post("/register", validateSignup, async (req, res) => {
	const { name, password } = req.body;
	const { email, createdBy } = req.invite;

	try {
		const createdUser = await createUser({ name, email, password, createdBy });
		res.status(200).send(createdUser);
	} catch (error) {
		res.status(400).send("Something went wrong");
	}
});

router.post("/login", validateLogin, async (req, res) => {
	const { email, name, id } = req.user;

	const user = { email, name, id };

	const accessToken = jwt.sign(user, secret_key_access, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign(user, secret_key_refresh, {
		expiresIn: "1d",
	});

	res
		.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			sameSite: "strict",
		})
		.header("Authorization", accessToken)
		.send(user);
});

router.post("/refresh", async (req, res) => {
	const refreshToken = req.cookies["refreshToken"];

	if (!refreshToken) {
		return res.status(401).send("Neej va synd, du hade ingen refreshtoken :/");
	}
	try {
		const decoded = jwt.verify(refreshToken, secret_key_refresh);
		const accessToken = jwt.sign({ email: decoded.email }, secret_key_access, {
			expiresIn: "15m",
		});
		res.status(200).header("Authorization", accessToken).send(decoded.email);
	} catch (error) {
		res.status(401).send("Neej va synd du får ingen ny token :'(");
	}
});

export default router;

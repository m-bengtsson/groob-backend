import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import db from "../models/index.js";
import {
	useGetUserByEmail,
	useGetUser,
	useUpdateUser,
	useCreateUser,
} from "../hooks/useUser.js";
import {
	useEmailValidate,
	usePassWordValidate,
} from "../hooks/useValidateRegEx.js";
import bcrypt from "bcrypt";
import useSendEmail from "../hooks/useSendEmail.js";
import { setFailedAttempts } from "../middleware/rateLimit.js";

dotenv.config();

const saltRounds = 10;
const secret_key_access = process.env.SECRET_KEY_ACCESS;
const secret_key_refresh = process.env.SECRET_KEY_REFRESH;
const secret_key_verify = process.env.SECRET_KEY_VERIFY;
const secret_key_reset = process.env.SECRET_KEY_RESET;

const ResetPasswordToken = db.resetPasswordToken;
const InvitedUser = db.invitedUser;

export const inviteUser = async (req, res) => {
	//todo: check validity of email
	const { email } = req.body;
	const { id } = req.user;

	try {
		useEmailValidate(email);
		const maybeUser = await useGetUserByEmail(email);
		if (maybeUser) {
			return res.status(400).send("Neej va syynd, emailen används redan :'(");
		}

		const maybeInvited = await InvitedUser.findOne({ where: { email } });
		if (maybeInvited) {
			await db.invitedUser.destroy({ where: { id: maybeInvited.id } });
		}

		const verificationToken = jwt.sign({ email }, secret_key_verify, {
			expiresIn: "15m",
		});

		await InvitedUser.create({
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
			html: `<p>Click <a href="http://localhost:5173/signup/${verificationToken}">here</a> to verify your email</p>`,
		};

		await useSendEmail(mailOptions, () => {
			throw new Error("Something went wrong");
		});

		//todo: remove verifixationtoken form response
		res.status(200).send("Vi har skickat ett mail till din angivna mailadress");
	} catch (error) {
		res.status(500).send("Something went wrong, try again later");
	}
};

export const requestResetPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const maybeUser = await useGetUserByEmail(email);
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

		const resetPasswordToken = jwt.sign(
			{ id: maybeUser.id },
			secret_key_reset,
			{
				expiresIn: "15m",
			}
		);

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
			html: `<p>Click <a href="http://localhost:5173/reset/?token_key=${resetPasswordToken}">here</a> to reset your password</p>`,
		};

		await useSendEmail(mailOptions, { res });

		//todo: remove token from response
		res
			.status(200)
			.send("Vi har skickat ett mail om din mailadress finns i vår databas");
	} catch (error) {
		console.log("ERROR: ", error);
		res.status(400).send("Sorry something went wrong, try again later");
	}
};

export const changePassword = async (req, res) => {
	const resetPasswordToken = req.headers["authorization"];

	if (!resetPasswordToken) {
		return res.status(400).send("Not verified");
	}

	try {
		const decoded = jwt.verify(
			resetPasswordToken,
			process.env.SECRET_KEY_RESET
		);

		const maybeUser = await useGetUser(decoded.id);

		if (!maybeUser) {
			return res.status(400).send("Sorry something went wrong");
		}

		const maybeRequested = await ResetPasswordToken.findOne({
			where: { userId: decoded.id },
		});

		if (!maybeRequested) {
			return res.status(400).send("Sorry something went wrong");
		}

		const { password, repeatPassword } = req.body;

		try {
			await usePassWordValidate(password, repeatPassword);
		} catch (error) {
			return res.status(400).send(error.message);
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const updatedUser = await useUpdateUser(
			{ password: hashedPassword, isLocked: false },
			maybeUser.id
		);

		setFailedAttempts();

		res.status(200).send("Password reset" + updatedUser);
	} catch (error) {
		console.log("ERROR ", error);
		return res.status(400).send("Sorry something went wrong");
	}
};

export const registerUser = async (req, res) => {
	const { name, password } = req.body;
	const { email, createdBy } = req.invite;

	try {
		const createdUser = await useCreateUser({
			name,
			email,
			password,
			createdBy,
		});

		res.status(200).send(createdUser);
	} catch (error) {
		res.status(400).send("Something went wrong");
	}
};

export const loginUser = async (req, res) => {
	const { email, name, id } = req.user;
	const user = { email, name, id };
	try {
		const accessToken = jwt.sign(user, secret_key_access, {
			expiresIn: "15m",
		});
		const refreshToken = jwt.sign(user, secret_key_refresh, {
			expiresIn: "1d",
		});
		await db.refreshToken.create({
			id: uuidv4(),
			token: refreshToken,
			userId: user.id,
		});

		return res
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				sameSite: "strict",
			})
			.header("Authorization", accessToken)
			.send(user);
	} catch (error) {
		return res.status(500).send("Something went wrong, try again later");
	}
};

export const logoutUser = async (req, res) => {
	const { id } = req.body;

	try {
		await db.refreshToken.destroy({ where: { userId: id } });
		return res
			.status(200)
			.clearCookie("refreshToken", { path: "/" })
			.send("Successfully logged out");
	} catch (error) {
		return res.status(500).send("Something went wrong, try again later");
	}
};

export const refresh = async (req, res) => {
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
};

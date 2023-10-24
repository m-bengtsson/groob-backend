import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateLogin } from "../middleware/validate.js";
import transporter from "../nodemailer.js";

const router = express.Router();
dotenv.config();

const secret_key = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
	const { email } = req.body;

	const verificationToken = jwt.sign({ email }, secret_key, {
		expiresIn: "15m",
	});
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Email verification",
		html: '<p>Click <a href="http://localhost:5173/login">here</a> to reset your password</p>',
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.status(400).send("Could not send verification email" + error);
		} else {
			res.status(200).send("Email sent" + info.response);
		}
	});
});

router.post("/login", validateLogin, async (req, res) => {
	const { email, name, id } = req.user;

	const user = { email, name, id };

	const accessToken = jwt.sign(user, secret_key, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign(user, secret_key, {
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
		const decoded = jwt.verify(refreshToken, secret_key);
		const accessToken = jwt.sign({ email: decoded.email }, secret_key, {
			expiresIn: "15m",
		});
		res.status(200).header("Authorization", accessToken).send(decoded.email);
	} catch (error) {
		res.status(401).send("Neej va synd du får ingen ny token :'(");
	}
});

export default router;

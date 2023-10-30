import { rateLimit } from "express-rate-limit";
import db from "../models/index.js";

let failedAttempts = {};

const User = db.user;

export const setFailedAttempts = () => {
	failedAttempts = {};
};

export const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: (req) => {
		const ip = req.ip;

		if (failedAttempts[ip] >= 9) {
			return 0;
		}
		return 3;
	},

	handler: async (req, res, next) => {
		const ip = req.ip;
		const { email } = req.body;
		failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;

		if (failedAttempts[ip] >= 9) {
			await User.update({ isLocked: true }, { where: { email } });

			return res.status(429).send("Reset password please");
		}
		return res.status(429).send("Too many requests, please try again later.");
	},
});

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the RateLimit-* headers
	legacyHeaders: false, // Disable the X-RateLimit-* headers
});

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
	const accessToken = req.headers["authorization"];
	const refreshToken = req.cookies["refreshToken"];

	if (!accessToken && !refreshToken) {
		return res.status(401).send("Access Denied. No token provided.");
	}
	try {
		const decoded = jwt.verify(accessToken, secret_key);
		req.user = decoded;
		next();
	} catch (error) {
		if (!refreshToken) {
			return res.status(401).send("Access Denied. No refresh token provided.");
		}

		try {
			const decoded = jwt.verify(refreshToken, secret_key);
			const accessToken = jwt.sign(decoded.user, secret_key, {
				expiresIn: "15m",
			});
			res
				.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					sameSite: "strict",
				})
				.header("Authorization", accessToken)
				.send(decoded.user);
		} catch (error) {
			return res.status(400).send("Invalid Token.");
		}
	}
};

export default authenticate;

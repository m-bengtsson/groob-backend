import { getUser } from "../controllers/user.controllers.js";

export const isAdmin = async (req, res, next) => {
	const { id } = req.user;

	const user = await getUser(id);
	if (user) {
		console.log("USER: ", user);
		if (user.role === "admin") {
			req.user = user;
			next();
		} else {
			return res.status(403).send("Neeej, vad synd, du är inte behörig");
		}
	} else {
		return res.status(403).send("Neeej, vad synd, du existerar inte");
	}
};

import { getUser } from "../controllers/user.controllers.js";

export const isAdmin = async (req, res, next) => {
	const { uid } = req.body;
	const user = await getUser(uid);
	if (user.roles === "admin") {
		req.user = user;
		next();
	} else {
		return res.status(403).send("Neeej, vad synd, du är inte behörig");
	}
};

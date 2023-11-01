import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import itemsRoute from "./routes/items.js";
import usersRoute from "./routes/users.js";
import identityRoute from "./routes/identity.js";
import db from "./models/index.js";
import logger from "./middleware/logger.js";
import { limiter } from "./middleware/rateLimit.js";

const app = express();
db.sequelize.sync();
app.use(
	cors({
		origin: "http://localhost:5173",
		exposedHeaders: "Authorization",
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: ["Content-Type", "X-Auth-Token", "Origin", "Authorization"],
	})
);
app.use(cookies());
app.use(express.json());
app.use(logger);
app.use(limiter);
app.use("/api/items", itemsRoute);
app.use("/api/users", usersRoute);
app.use("/api/identity", identityRoute);

app.get("/api/db", async (req, res) => {
	const User = db.user;
	const allUsers = await User.findOne({ where: { name: "Groob" } });
	res.status(200).send(allUsers);
});

app.listen(8080, () => {
	console.log("Server running on port 8080");
});

import db from "../models/index.js";
import bcrypt from "bcrypt";
import mockUsers from "./mockUsers.json" assert { type: "json" };
import mockItems from "./mockItems.json" assert { type: "json" };

const saltRounds = 10;

db.sequelize.sync({ force: true }).then(() => {
	console.log("Drop and Resync Db");
	initial();
});

const hashedPassword = await bcrypt.hash("Password123!", saltRounds);

const User = db.user;
const Item = db.item;

const initial = () => {
	mockUsers.map((user) => User.create(user));

	mockItems.map((item) => Item.create(item));
};

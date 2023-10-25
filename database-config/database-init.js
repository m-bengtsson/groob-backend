import db from "../models/index.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

db.sequelize.sync({ force: true }).then(() => {
	console.log("Drop and Resync Db");
	initial();
});

const hashedPassword = await bcrypt.hash("password123", saltRounds);

const User = db.user;
const Item = db.item;

const initial = () => {
	User.create({
		id: "123",
		name: "Groob",
		email: "groobgroobsson@gmail.com",
		password: hashedPassword,
		role: "admin",
		createdBy: "123",
	});
	User.create({
		id: "456",
		name: "Rut",
		email: "rut@rut.com",
		password: hashedPassword,
		createdBy: "123",
	});
	User.create({
		id: "789",
		name: "reuben",
		email: "reuben@reuben.com",
		password: hashedPassword,
		createdBy: "123",
	});
	Item.create({
		id: "1123",
		title: "Red socks ",
		description: "A pair of red socks",
		numberOfItems: "15",
		createdBy: "123",
	});
	Item.create({
		id: "1456",
		title: "Blue shirt",
		description: "Shirt made out of cotton",
		numberOfItems: "5",
		createdBy: "123",
	});
	Item.create({
		id: "1789",
		title: "Green",
		description: "A pair of green pants made out of linen",
		numberOfItems: "8",
		createdBy: "123",
	});
};

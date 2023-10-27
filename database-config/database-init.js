import db from "../models/index.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

const hashedPassword = await bcrypt.hash("Password123!", saltRounds);

const User = db.user;
const Item = db.item;

const initial = () => {
  User.create({
    id: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
    name: "Groob",
    email: "groobgroobsson@gmail.com",
    password: hashedPassword,
    role: "admin",
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
  User.create({
    id: "f1e54fd3-ee99-41db-88c8-59ddde3b5fb9",
    name: "Rut",
    email: "rut@rut.com",
    password: hashedPassword,
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
  User.create({
    id: "b95faf78-a882-44cd-a6b6-02ad542fdf9e",
    name: "reuben",
    email: "reuben@reuben.com",
    password: hashedPassword,
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
  Item.create({
    id: "ec59cfcf-c2b3-4082-97af-02b98cab0294",
    title: "Red socks ",
    description: "A pair of red socks",
    numberOfItems: "15",
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
  Item.create({
    id: "05c0296e-5c0e-4fd9-b2d9-c6537dc78dfc",
    title: "Blue shirt",
    description: "Shirt made out of cotton",
    numberOfItems: "5",
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
  Item.create({
    id: "7c6c085b-7d98-4eb5-be8d-79c3eefc036c",
    title: "Green",
    description: "A pair of green pants made out of linen",
    numberOfItems: "8",
    createdBy: "36c5179f-6e18-428c-8ac2-4c590fc3e457",
  });
};

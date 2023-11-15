import db from "../models/index.js";
import mockUsers from "./mockUsers.json" assert { type: "json" };
import mockItems from "./mockItems.json" assert { type: "json" };

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

const User = db.user;
const Item = db.item;

const initial = () => {
  mockUsers.map((user) => User.create(user));

  mockItems.map((item) => Item.create(item));
};

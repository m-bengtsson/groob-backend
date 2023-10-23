import { Sequelize, DataTypes } from "sequelize";
import config from "../database-config/connection.js";
import userModel from "./user.model.js"
import itemModel from "./item.model.js"
import refreshTokenModel from "./refreshToken.model.js"

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
   host: config.HOST,
   dialect: config.dialect,
   pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
   },
});

const db = {};

db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.user = userModel(sequelize, DataTypes);
db.item = itemModel(sequelize, DataTypes);
db.refreshToken = refreshTokenModel(sequelize, DataTypes);

export default db;
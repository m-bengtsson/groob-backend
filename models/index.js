import { Sequelize, DataTypes } from "sequelize";
import config from "../database-config/connection.js";
import userModel from "./user.model.js";
import itemModel from "./item.model.js";
import refreshTokenModel from "./refreshToken.model.js";
import invitedUserModel from "./invitedUser.model.js";

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
db.invitedUser = invitedUserModel(sequelize, DataTypes);

db.user.hasMany(db.item, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

db.item.belongsTo(db.user, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

db.user.hasMany(db.item, {
   foreignKey: {
      name: "updatedBy",
      foreignKeyConstraint: true
   }
});

db.item.belongsTo(db.user, {
   foreignKey: {
      name: "updatedBy",
      foreignKeyConstraint: true
   }
});

// Users to users
db.user.hasMany(db.user, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

db.user.belongsTo(db.user, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

db.user.hasMany(db.user, {
   foreignKey: {
      name: "updatedBy",
      foreignKeyConstraint: true
   }
});

db.user.belongsTo(db.user, {
   foreignKey: {
      name: "updatedBy",
      foreignKeyConstraint: true
   }
});

// InvitedUsers
db.user.hasMany(db.invitedUser, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

db.invitedUser.belongsTo(db.user, {
   foreignKey: {
      name: "createdBy",
      foreignKeyConstraint: true
   }
});

// Refreshtoken
db.refreshToken.belongsTo(db.user);

export default db;
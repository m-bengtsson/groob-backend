const userModel = (sequelize, DataTypes) => {
   const User = sequelize.define("users", {
      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         unique: true,
         allowNull: false,
      },
      name: {
         type: DataTypes.STRING(36),
         allowNull: false,
      },
      email: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
      },
      password: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      role: {
         type: DataTypes.STRING(32),
         defaultValue: "user",
      },
      createdBy: {
         type: DataTypes.UUID,
         allowNull: false,
      },
      updatedBy: {
         type: DataTypes.UUID,
         allowNull: true,
      }
   })
   return User;
}

export default userModel;
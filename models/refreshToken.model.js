const refreshTokenModel = (sequelize, DataTypes) => {
   const RefreshToken = sequelize.define("refreshTokens", {
      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         allowNull: false,
         unique: true,
      },
      token: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
   })
   return RefreshToken;
}

export default refreshTokenModel;
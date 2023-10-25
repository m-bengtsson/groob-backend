const invitedUserModel = (sequelize, DataTypes) => {
   const InvitedUser = sequelize.define("invitedUsers", {
      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         allowNull: false,
         unique: true,
      },
      email: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
      },
      token: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      createdBy: {
         type: DataTypes.UUID,
         allowNull: false,
      },
   })
   return InvitedUser;
}

export default invitedUserModel;
const resetPasswordTokenModel = (sequelize, DataTypes) => {
	const ResetPasswordToken = sequelize.define("resetPasswordTokens", {
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
	});
	return ResetPasswordToken;
};

export default resetPasswordTokenModel;

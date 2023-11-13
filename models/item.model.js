const itemModel = (sequelize, DataTypes) => {
	const Item = sequelize.define(
		"Items",
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING(36),
				allowNull: false,
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT({ length: "long" }),
				allowNull: false,
			},

			numberOfItems: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			createdBy: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			updatedBy: {
				type: DataTypes.UUID,
				allowNull: true,
			},
		},
		{
			paranoid: true,
		}
	);
	return Item;
};

export default itemModel;

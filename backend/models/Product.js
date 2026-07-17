const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  category: { type: DataTypes.STRING, allowNull: false },
  imageUrl: {
    type: DataTypes.STRING,
    defaultValue: "https://placehold.co/400x400?text=Product",
  },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
  createdBy: { type: DataTypes.UUID, allowNull: true }, // id of the admin who added it
});

module.exports = Product;

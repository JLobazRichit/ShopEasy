const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// In MongoDB, order items were embedded inside the Order document.
// In a relational (SQL) database, each order item is its own row in its
// own table, linked to the Order and the Product via foreign keys.
const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }, // snapshot of product name at purchase time
  image: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false }, // snapshot of price at purchase time
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
});

module.exports = OrderItem;

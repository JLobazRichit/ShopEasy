const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Delivered", "Cancelled"),
    defaultValue: "Pending",
  },
  // Shipping address fields (flattened — SQL tables don't nest objects like MongoDB does)
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  postalCode: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Order;

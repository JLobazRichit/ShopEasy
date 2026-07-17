const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// --- Relationships (this is the SQL equivalent of Mongoose's "ref") ---

// One user can place many orders
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// One order has many order items (as: "orderItems" lets us write order.orderItems)
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Each order item points back to the original product
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = { sequelize, User, Product, Order, OrderItem };

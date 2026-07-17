const { sequelize, Order, OrderItem, Product, User } = require("../models");

// @route  POST /api/orders
// @access Private (customer checks out their cart)
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // A transaction makes sure that ALL steps (stock checks, stock updates,
  // creating the order, creating the order items) succeed together, or
  // none of them happen at all — so we never end up with a half-created order.
  const t = await sequelize.transaction();

  try {
    // Recalculate the total on the SERVER using real DB prices.
    // Never trust a total price sent from the frontend.
    let totalPrice = 0;
    const itemsToCreate = [];

    for (const item of orderItems) {
      const product = await Product.findByPk(item.product, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      totalPrice += product.price * item.quantity;
      itemsToCreate.push({
        productId: product.id,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        quantity: item.quantity,
      });

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    const order = await Order.create(
      {
        userId: req.user.id,
        totalPrice,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      itemsToCreate.map((item) => ({ ...item, orderId: order.id })),
      { transaction: t }
    );

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "orderItems" }] });
    res.status(201).json(fullOrder);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/my
// @access Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: "orderItems" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/:id
// @access Private (owner or admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: "orderItems" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.userId === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders
// @access Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: "orderItems" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/orders/:id/status
// @access Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };

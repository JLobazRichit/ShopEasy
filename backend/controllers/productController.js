const { Op } = require("sequelize");
const { Product } = require("../models");

// @route  GET /api/products?keyword=shoes&category=Footwear
// @access Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const where = {};

    if (keyword) {
      // SQLite LIKE is case-insensitive for plain ASCII text by default
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const products = await Product.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/products
// @access Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    if (!name || !description || price == null || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, imageUrl, stock } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.imageUrl = imageUrl ?? product.imageUrl;
    product.stock = stock ?? product.stock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

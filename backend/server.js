const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");

const app = express();

app.use(cors());          // allows the React frontend (different port) to call this API
app.use(express.json());  // lets us read JSON from req.body

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("E-Commerce API is running...");
});

// Catch-all error handler (keeps the server from crashing on unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

// sequelize.sync() looks at your models and creates/updates the matching
// SQLite tables automatically — no manual migrations needed for this project.
sequelize
  .sync()
  .then(() => {
    console.log("SQLite database synced (database.sqlite)");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to sync database:", err.message);
    process.exit(1);
  });

const { Sequelize } = require("sequelize");
require("dotenv").config();

// SQLite needs no server, no install, no network setup — it just stores
// everything in a single file on disk (database.sqlite), created automatically
// the first time the app runs.
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./database.sqlite",
  logging: false, // set to console.log if you want to see every SQL query
});

module.exports = sequelize;

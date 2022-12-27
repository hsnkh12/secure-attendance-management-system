const Sequelize = require("sequelize");
require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, "root", DB_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
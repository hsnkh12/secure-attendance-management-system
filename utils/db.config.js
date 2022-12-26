const Sequelize = require("sequelize");
const sequelize = new Sequelize("attancdance", "root", "my-secret-pw", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
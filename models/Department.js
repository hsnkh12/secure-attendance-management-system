const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");

const Department = sequelize.define("Department", {
    depId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });


module.exports = Department;
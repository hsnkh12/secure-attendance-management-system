const Department = require("./Department");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");

const Course = sequelize.define("Course", {
    courseCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });

Course.belongsTo(Department, { foreignKey: "depId" });

module.exports = Course;
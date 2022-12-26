const Department = require("./Department");
const User = require("./User");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const Teacher = sequelize.define("Teacher", {
    userid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateJoined: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastLogin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employeeId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
});
Teacher.belongsTo(Department, { foreignKey: "depId" });

module.exports = Teacher;
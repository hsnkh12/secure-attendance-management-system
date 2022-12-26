const Department = require("./Department");
const User = require("./User");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const Student = sequelize.define("Student", {
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
    studentId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    currentCredits: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pastCredits: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CGPA: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    GPA: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
Student.belongsTo(Department, { foreignKey: "depId" });

module.exports = Student;
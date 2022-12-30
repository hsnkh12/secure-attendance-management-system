const Student = require("./Student");
const User = require("./User");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const Parent = sequelize.define(
    "Parent", {
        userId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,

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
        studentUserId: {
            type: DataTypes.STRING,
            references: {
                model: Student,
                key: 'userId',
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
                foreignKey: "userId",
                allowNull: true,

            }
        },
    }, { timestamps: false }
);


module.exports = Parent;
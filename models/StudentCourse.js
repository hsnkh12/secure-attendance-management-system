const OfferedCourse = require("./OfferedCourse");
const Student = require("./Student");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const StudentCourse = sequelize.define("StudentCourse", {
    userId: {
        type: DataTypes.STRING,
        references: {
            model: Student,
            key: 'userId',
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        allowNull: true,
    },
    offeredCourseCode: {
        type: DataTypes.STRING,
        references: {
            model: OfferedCourse,
            key: 'offeredCourseCode',
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    },

}, {
    timestamps: false,
    indexes: [{
        fields: ['userId', 'offeredCourseCode'],
        unique: true
    }]
});

module.exports = StudentCourse;
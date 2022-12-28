const Course = require("./Course");
const Teacher = require("./Teacher");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const OfferedCourse = sequelize.define("OfferedCourse", {
    offeredCourseCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,

    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });

OfferedCourse.belongsTo(Teacher, {
    foreignKey: "userId",
    onDelete: 'SET NULL',
    onUpdate: "CASCADE",
    allowNull: true,
});
OfferedCourse.belongsTo(Course, {
    foreignKey: "courseCode",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    allowNull: true,

});

module.exports = OfferedCourse;
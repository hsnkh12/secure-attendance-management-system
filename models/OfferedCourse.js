const Course = require("./Course");
const Teacher = require("./Teacher");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const OfferedCourse = sequelize.define("OfferedCourse", {
    offeredCourseCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
});
OfferedCourse.belongsTo(Teacher, { foreignKey: "employeeId" });
OfferedCourse.belongsTo(Course, { foreignKey: "courseCode" });

module.exports = OfferedCourse;
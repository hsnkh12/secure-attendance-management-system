const Student = require("./Student");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const OfferedCourse = require("./OfferedCourse");

const Attendance = sequelize.define("Attendance", {
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPresent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
Attendance.belongsTo(OfferedCourse, { foreignKey: "offeredCourseCode" });
Attendance.belongsTo(Student, { foreignKey: "studentId" });
module.exports = Attendance;
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
}, { timestamps: false });

Attendance.belongsTo(OfferedCourse, {
    foreignKey: "offeredCourseCode",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: true,

});
Attendance.belongsTo(Student, {
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: true,
});
module.exports = Attendance;
const OfferedCourse = require("./OfferedCourse");
const Student = require("./Student");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const StudentCourse = sequelize.define("StudentCourse", {});
StudentCourse.belongsTo(OfferedCourse, { foreignKey: "offeredCourseCode" });
StudentCourse.belongsTo(Student, { foreignKey: "studentId" });

module.exports = StudentCourse;
const OfferedCourse = require("./OfferedCourse");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const OfferedCourseTime = sequelize.define("OfferedCourseTime", {
    dateTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
OfferedCourseTime.belongsTo(OfferedCourse, { foreignKey: "offeredCourseCode" });

module.exports = OfferedCourseTime;
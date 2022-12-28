const OfferedCourse = require("./OfferedCourse");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.config");
const OfferedCourseTime = sequelize.define("OfferedCourseTime", {
    dateTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });

OfferedCourseTime.belongsTo(OfferedCourse, {
    foreignKey: "offeredCourseCode",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: true,
});

module.exports = OfferedCourseTime;
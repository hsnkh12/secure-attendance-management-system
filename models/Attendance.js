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
    userId: {
        type: DataTypes.STRING,
        references: {
            model: Student,
            key: 'userId',
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            allowNull: true,
        }
    },
    offeredCourseCode: {
        type: DataTypes.STRING,
        references: {
            model: OfferedCourse,
            key: 'offeredCourseCode',
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            allowNull: true,

        }
    },
}, {
    timestamps: false,
    indexes: [{
        fields: ['userId', 'offeredCourseCode', 'date'],
        unique: true
    }]
});


module.exports = Attendance;
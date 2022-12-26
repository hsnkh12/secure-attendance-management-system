const Course = require("./Course");
const Teacher = require("./Teacher");

const OfferedCourse = sequelize.define("OfferedCourse", {
    offeredCourseCode: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    courseCode: {
        type: Sequelize.STRING,
        references: {
            model: Course,
            key: "courseCode",
        },
    },
    teacher: {
        type: Sequelize.STRING,
        references: {
            model: Teacher,
            key: "employeeId",
        },
    },
    semester: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    group: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    startDate: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    endDate: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = OfferedCourse;
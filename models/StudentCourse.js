const OfferedCourse = require("./OfferedCourse");
const Student = require("./Student");

const StudentCourse = sequelize.define("StudentCourse", {
    courseCode: {
        type: Sequelize.STRING,
        references: {
            model: Student,
            key: "studentId",
        },
    },
    courseCode: {
        type: Sequelize.STRING,
        references: {
            model: OfferedCourse,
            key: "offeredCourseCode",
        },
    }
});

module.exports = StudentCourse;
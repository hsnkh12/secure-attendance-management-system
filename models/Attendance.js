
const Attendance = sequelize.define("Attendance", {
    courseCode: {
        type: Sequelize.STRING,
        references: {
            model: OfferedCourse,
            key: "offeredCourseCode",
        },
    },
    student: {
        type: Sequelize.STRING,
        references: {
            model: Student,
            key: "studentId",
        },
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPresent: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Attendance;
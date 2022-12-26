const OfferedCourse = require("./OfferedCourse");

const OfferedCourseTime = sequelize.define("OfferedCourseTime", {
    offeredCourseCode: {
        type: Sequelize.STRING,
        references: {
            model: OfferedCourse,
            key: "offeredCourseCode",
        },
    },
    dateTime: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = OfferedCourseTime;
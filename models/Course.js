const Department = require("./Department");

const Course = sequelize.define("Course", {
    courseCode: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    department: {
        type: Sequelize.STRING,
        references: {
            model: Department,
            key: "depId",
        },
    },
});

module.exports = Course;
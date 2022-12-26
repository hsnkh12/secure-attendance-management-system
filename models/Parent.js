const Student = require("./Student");
const User = require("./User");

const Parent = User.extend({
    studentId: {
        type: Sequelize.STRING,
        references: {
            model: Student,
            key: "studentId",
        },
    },
    // student ID is enough because User already has first name and Last Name
});

module.exports = Parent;
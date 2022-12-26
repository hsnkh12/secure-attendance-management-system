const Department = require("./Department");
const User = require("./User");

const Student = User.extend({
    studentId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    currentCredits: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    pastCredits: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    CGPA: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    GPA: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    department: {
        type: Sequelize.STRING,
        references: {
            model: Department,
            key: 'depId'
        }
    }

});

module.exports = Student;
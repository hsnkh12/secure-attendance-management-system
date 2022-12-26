const Department = require("./Department");
const User = require("./User");

const Teacher = User.extend({
    employeeId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    department: {
        type: Sequelize.STRING,
        references: {
            model: Department,
            key: 'depId'
        }
    }

});

module.exports = Teacher;
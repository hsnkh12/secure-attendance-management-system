const User = sequelize.define("User", {
    userid: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dateJoined: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastLogin: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dateOfBirth: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = User;
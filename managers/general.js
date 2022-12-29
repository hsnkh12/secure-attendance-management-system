const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const Parent = require('../models/Parent')
const User = require('../models/User')


const checkUsernameIsTaken = async (userId) => {

    let user = await Student.findOne({
        where: {
            userId: userId,
        },
    });
    if (user === null) {
        user = await Teacher.findOne({
            where: {
                userId: userId,
            },
        });
    }
    if (user === null) {
        user = await Parent.findOne({
            where: {
                userId: userId,
            },
        });
    }
    if (user === null) {
        user = await User.findOne({
            where: {
                userId: userId,
            },
        });
    }

    if (user != null ){
        return true;
    }

    return false;

}


const getUserByUserId = async (userId) => {

    let user = await Student.findOne({
        where: {
            userId: userId,
        },
    });
    if (user === null) {
        user = await Teacher.findOne({
            where: {
                userId: userId,
            },
        });
    }
    if (user === null) {
        user = await Parent.findOne({
            where: {
                userId: userId,
            },
        });
    }
    if (user === null) {
        user = await User.findOne({
            where: {
                userId: userId,
            },
        });
    }

    return user;

    
}

module.exports = {
    checkUsernameIsTaken,
    getUserByUserId
}
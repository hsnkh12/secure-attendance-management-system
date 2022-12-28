const Teacher = require('../models/Teacher')



const getTeacherByEmployeeId = async(employeeId) => {

    return await Teacher.findOne({
        where: {
            employeeId: employeeId,
        },
    });
}

const getTeacherByUserId = async(userId) => {

    return await Teacher.findOne({
        where: {
            userId: userId,
        },
    });
}

module.exports = {
    getTeacherByEmployeeId,
    getTeacherByUserId
}
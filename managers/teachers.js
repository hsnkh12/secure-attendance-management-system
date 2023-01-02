const Teacher = require('../models/Teacher')
const {Des}= require('../utils/des')
const {PasswordManager} = require('../utils/password')


const getAllTeachersBydepId = async (depId) => {

    return await Teacher.findAll({
        where: {
            depId: depId,
        },
    });
}

const getTeacherByEmployeeId = async (employeeId) => {

    return await Teacher.findOne({
        where: {
            employeeId: employeeId,
        },
    });
}

const getTeacherByUserId = async (userId) => {

    return await Teacher.findOne({
        where: {
            userId: userId,
        },
    });
}

const createNewEncryptedTeacher = async (body, userId) =>{

    return await Teacher.create({
        firstName: await Des.encrypt(body.firstName),
        lastName: await Des.encrypt(body.lastName),
        employeeId: await Des.encrypt(body.employeeId),
        email: await Des.encrypt(body.email),
        password: await Des.encrypt(
            await PasswordManager.hashPassword(body.password)
        ),
        role: await Des.encrypt(body.Urole),
        dateJoined: await Des.encrypt(body.dateJoined.toString()),
        dateOfBirth: await Des.encrypt(body.dateOfBirth.toString()),
        userId: userId,
        depId: await Des.encrypt(body.depId),
    });

}

const getDecryptedTeachers = async (teachers) => {

    return await Promise.all(
        teachers.map(async(user) => ({
            userId: await Des.dencrypt(user.userId),
            email: await Des.dencrypt(user.email),
            firstName: await Des.dencrypt(user.firstName),
            lastName: await Des.dencrypt(user.lastName),
            dateJoined: await Des.dencrypt(user.dateJoined),
            lastLogin: await Des.dencrypt(user.lastLogin),
            dateOfBirth: await Des.dencrypt(user.dateOfBirth),
            employeeId: await Des.dencrypt(user.employeeId),
            depId: await Des.dencrypt(user.depId),
        }))
    );
}

const getDecryptedTeacher = async (teacher) => {

    return {
        userId: await Des.dencrypt(teacher.userId),
        email: await Des.dencrypt(teacher.email),
        firstName: await Des.dencrypt(teacher.firstName),
        lastName: await Des.dencrypt(teacher.lastName),
        dateJoined: await Des.dencrypt(teacher.dateJoined),
        lastLogin: await Des.dencrypt(teacher.lastLogin),
        dateOfBirth: await Des.dencrypt(teacher.dateOfBirth),
        employeeId: await Des.dencrypt(teacher.employeeId),
        depId: await Des.dencrypt(teacher.depId),
    };
}

module.exports = {
    getTeacherByEmployeeId,
    getTeacherByUserId,
    getDecryptedTeachers,
    createNewEncryptedTeacher,
    getDecryptedTeacher,
    getAllTeachersBydepId
}
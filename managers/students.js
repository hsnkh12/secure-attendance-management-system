const Parent = require("../models/Parent");
const Student = require("../models/Student");
const StudentCourse = require("../models/StudentCourse");
const { Des } = require("../utils/des");
const {PasswordManager} = require('../utils/password')
const {Teacher} = require('../models/Teacher')

const getStudentByStdId = async (studentId) => {
    return await Student.findOne({
        where: {
            studentId: studentId,
        },
    });
}

const getStudentByUserId = async (userId) => {

    return await Student.findOne({
        where: {
            userId: userId,
        },
    })
}


const getStudentCourseByOffCourseId = async (offeredCourseId) => {

    return await StudentCourse.findAll({
        where: {
            offeredCourseCode: offeredCourseId,
        },
    });
}

const getAllStudentsById = async (studentId) =>{

    return await Student.findAll({
        where: {
            studentId: studentId,
        },
    });

}

const getAllStudentsByDepId = async (depId) => {

    return await Student.findAll({
        where: {
            depid: depId,
        },
    });
}

const getDecryptedStudents = async (students) => {

    return await Promise.all(
        students.map(async(user) => ({
            userId: await Des.dencrypt(user.userId),
            email: await Des.dencrypt(user.email),
            firstName: await Des.dencrypt(user.firstName),
            lastName: await Des.dencrypt(user.lastName),
            dateJoined: await Des.dencrypt(user.dateJoined),
            lastLogin: await Des.dencrypt(user.lastLogin),
            dateOfBirth: await Des.dencrypt(user.dateOfBirth),
            studentId: await Des.dencrypt(user.studentId),
            currentCredits: await Des.dencrypt(user.currentCredits),
            pastCredits: await Des.dencrypt(user.pastCredits),
            CGPA: await Des.dencrypt(user.CGPA),
            GPA: await Des.dencrypt(user.GPA),
            depId: await Des.dencrypt(user.depId),
        }))
    );

}


const getDecryptedStudent = async (student) => {

    return {
        userId: await Des.dencrypt(student.userId),
        email: await Des.dencrypt(student.email),
        firstName: await Des.dencrypt(student.firstName),
        lastName: await Des.dencrypt(student.lastName),
        dateJoined: await Des.dencrypt(student.dateJoined),
        lastLogin: await Des.dencrypt(student.lastLogin),
        dateOfBirth: await Des.dencrypt(student.dateOfBirth),
        studentId: await Des.dencrypt(student.studentId),
        currentCredits: await Des.dencrypt(student.currentCredits),
        pastCredits: await Des.dencrypt(student.pastCredits),
        CGPA: await Des.dencrypt(student.CGPA),
        GPA: await Des.dencrypt(student.GPA),
        depId: await Des.dencrypt(student.depId),
    };
}

const createNewEncryptedStudent = async (body) => {

    return await Student.create({
        firstName: await Des.encrypt(body.firstName),
        lastName: await Des.encrypt(body.lastName),
        studentId: await Des.encrypt(body.studentId),
        email: await Des.encrypt(body.email),
        password: await Des.encrypt(
            await PasswordManager.hashPassword(body.password)
        ),
        role: await Des.encrypt("S"),
        dateJoined: await Des.encrypt(body.dateJoined.toString()),
        dateOfBirth: await Des.encrypt(body.dateOfBirth.toString()),
        userId: await Des.encrypt(body.userId),
        depId: await Des.encrypt(body.depId),
    });
}



module.exports = {
    getStudentCourseByOffCourseId,
    getAllStudentsById,
    getDecryptedStudents,
    getAllStudentsByDepId,
    getStudentByStdId,
    getStudentByUserId,
    createNewEncryptedStudent,
    getDecryptedStudent
}
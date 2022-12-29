const Parent = require('../models/Parent')
const {getStudentByUserId} = require('./students')
const {PasswordManager} = require('../utils/password')
const {Des} = require('../utils/des')


const getParentByUserId = async (userId) => {

    return await Parent.findOne({
        where: {
            userId: userId,
        },
    });

}

const getDecryptedParents = async(parents) => {

    return  await Promise.all(parents.map(async(user) => {
        let student = await getStudentByUserId(user.studentUserId);
        if (student == null) {
            student = {
                studentId: null
            }
        };
        return {
            userId: await Des.dencrypt(user.userId),
            email: await Des.dencrypt(user.email),
            firstName: await Des.dencrypt(user.firstName),
            lastName: await Des.dencrypt(user.lastName),
            dateJoined: await Des.dencrypt(user.dateJoined),
            lastLogin: await Des.dencrypt(user.lastLogin),
            dateOfBirth: await Des.dencrypt(user.dateOfBirth),
            studentId: await Des.dencrypt(student.studentId),
            currentCredits: await Des.dencrypt(user.currentCredits),
            pastCredits: await Des.dencrypt(user.pastCredits),
            CGPA: await Des.dencrypt(user.CGPA),
            GPA: await Des.dencrypt(user.GPA),
            depId: await Des.dencrypt(user.depId),
        }
        })
    )
}




module.exports = {
    getParentByUserId,
    getDecryptedParents
}
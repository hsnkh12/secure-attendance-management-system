const {Des} = require('../utils/des')
const Attendance = require('../models/Attendance')



const getAllAttendanceByOfferedCourseCode = async (offeredCourseCode) => {
    return await Attendance.findAll({
        where: {
            offeredCourseCode: offeredCourseCode
        }
    })
}

const getDecryptedAttendances = async (attendanceList) => {
    return await Promise.all(
        attendanceList.map(async(attendance) => {
            const student = await getStudentByUserId(attendance.userId);
            const course = await getOfferedCourseById(attendance.offeredCourseCode);
            return {
                CourseCode: await Des.dencrypt(course.courseCode),
                date: await Des.dencrypt(attendance.date),
                isPresent: await Des.dencrypt(attendance.isPresent),
                studentId: await Des.dencrypt(student.studentId),
            }
        })
    );
}

module.exports = {
    getAllAttendanceByOfferedCourseCode,
    getDecryptedAttendances
}
const { getOfferedCourseById, getCourseById } = require("../managers/courses");
const { getParentByUserId } = require("../managers/parents");
const { getStudentByStdId, getStudentByUserId } = require("../managers/students");
const { getTeacherByUserId } = require("../managers/teachers");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const { Des } = require("../utils/des");

const listAttendanceController = async(req, res) => {

    const offeredCourseCode = await Des.encrypt(req.params.offeredCourseID)
    const date = req.query.date

    // Check if offered course id and date mentioned in the url 
    if (!offeredCourseCode) {
        return res.status(400).send({ 'Message': 'Offered course id should be provided in the URL' })
    }

    try {

        // Dummy method to get the attendances related to (offered course code and date)
        const attendanceList = await Attendance.findAll({
            where: {
                offeredCourseCode: offeredCourseCode
            }
        })

        if (req.role == 'T') {

            // Dummy method to get offered course related to (offered course code)
            const offeredCourse = await getOfferedCourseById(offeredCourseCode)
            if (offeredCourse.userId != req.userID) {
                return res.status(403).json({ 'Message': 'Only teacher associated with this course can check attendance details' })
            }


        } else if (req.role == 'C') {

            // Get course assoiated with the offered course 
            const offeredCourse = await getOfferedCourseById(offeredCourseCode)
            const course = await getCourseById(offeredCourse.courseCode)
            const chair = await getTeacherByUserId(req.userID)
            if (chair.depId != course.depId) {
                return res.status(403).json({ 'Message': 'this course is not in your department' })
            }
        } else if (req.role == 'P') {
            const offeredCourse = await getOfferedCourseById(offeredCourseCode)
            const course = await getCourseById(offeredCourse.courseCode)
            const parent = await getParentByUserId(req.userID);
            const transformedattendance = await Promise.all(
                attendanceList.map(async(attendance) => {
                    const student = await getStudentByUserId(attendance.userId);

                    if (student.userId == parent.studentUserId) {
                        return {
                            CourseCode: await Des.dencrypt(course.courseCode),
                            date: await Des.dencrypt(attendance.date),
                            isPresent: await Des.dencrypt(attendance.isPresent),
                            studentId: await Des.dencrypt(student.studentId),
                        }
                    }
                })
            );
            return res.json(transformedattendance.filter((element) => element != null));

        } else if (req.role != 'A') {
            return res.status(403).send({ 'Message': 'Only admin, chairs, and teachers are allowed to check the attendance of the students' })
        }

        const transformedattendance = await Promise.all(
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

        return res.json(transformedattendance)



    } catch (error) {
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}

const createAttendanceController = async(req, res) => {

    try {

        const body = req.body
        const offeredCourseID = await Des.encrypt(req.params.offeredCourseID)
        if (req.role != 'A' && req.role != 'T') {
            return res.status(403).send({ 'Message': 'Only a teacher and admin can add new attendance' })
        }
        if (req.role == 'T') {
            const offeredCourse = await getOfferedCourseById(offeredCourseID);
            if (offeredCourse.userId != req.userID) {
                return res.status(403).send({ 'Message': 'Only teacher teaches this course can add new attendance' })
            }

        }

        const student = await getStudentByStdId(await Des.encrypt(body.studentId));
        // create new attendance
        const attendance = await Attendance.create({
            offeredCourseCode: offeredCourseID,
            date: await Des.encrypt(req.body.date.toString()),
            isPresent: await Des.encrypt(body.isPresent),
            userId: student.userId,
        })
        await attendance.save()
        return res.status(200).send({ 'Message': 'Attendance added' })


    } catch (error) {
        console.log(error)
        return res.status(503).send({ 'Message': 'Something went wrong' })
    }

}

const updateAttendanceInformationController = async(req, res) => {


    try {
        if (req.role == "A" || req.role == "T") {
            const offeredCourseID = await Des.encrypt(req.params.offeredCourseID);
            const date = await Des.encrypt(req.body.date);
            const student = await getStudentByStdId(await Des.encrypt(req.body.studentId));
            if (req.role == "T") {
                const teacherId = req.userId;
                const offeredCourse = await getOfferedCourseById(offeredCourseID);
                console.log(offeredCourse);
                if (offeredCourse.userId != req.userID) {
                    return res.status(403).send({ 'Message': "you don't offer this course" })

                }
            }
            const value = req.body.value;
            const varName = req.body.varName;
            const newData = {
                varName: value
            }
            const status = await Attendance.update(newData, {
                where: {
                    offeredCourseCode: offeredCourseID,
                    date: date,
                    userId: student.userId
                }
            })

            return res.status(200).json(status == 1)
        }


        return res.status(403).send({ 'Message': 'you are not allowed to update the course' })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}

const deleteAttendanceController = async(req, res) => {

    try {
        if (req.role == "A" || req.role == "T") {
            const offeredCourseID = await Des.encrypt(req.params.offeredCourseID);
            const date = await Des.encrypt(req.body.date);
            const student = await getStudentByStdId(await Des.encrypt(req.body.studentId));
            if (req.role == "T") {
                const offeredCourse = await getOfferedCourseById(offeredCourseID);
                if (offeredCourse.userId != req.userID) {
                    return res.status(403).send({ 'Message': "you don't offer this course" })

                }
            }

            const status = await Attendance.destroy({
                where: {
                    offeredCourseCode: offeredCourseID,
                    date: date,
                    userId: student.userId
                }
            })

            return res.status(200).json(status == 1)
        }


        return res.status(403).send({ 'Message': 'you are not allowed to delete the course' })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}


module.exports = {
    listAttendanceController,
    createAttendanceController,
    updateAttendanceInformationController,
    deleteAttendanceController

}
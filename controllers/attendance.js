const { getOfferedCourseById, getCourseById } = require("../managers/courses");
const { getParentByUserId } = require("../managers/parents");
const {
    getStudentByStdId,
    getStudentByUserId,
} = require("../managers/students");
const { getTeacherByUserId } = require("../managers/teachers");
const Attendance = require("../models/Attendance");
const { Des } = require("../utils/des");
const {
    getAllAttendanceByOfferedCourseCode,
    getDecryptedAttendances,
} = require("../managers/attendance");

const listAttendanceController = async(req, res) => {
    const offeredCourseCode = await Des.encrypt(req.params.offeredCourseID);

    // Check if offered course id and date mentioned in the url
    if (!offeredCourseCode) {
        return res
            .status(400)
            .send({ Message: "Offered course id should be provided in the URL" });
    }

    try {
        // Get the attendances related to offered course
        const attendanceList = await getAllAttendanceByOfferedCourseCode(
            offeredCourseCode
        );

        // Check if role is either Teacher, Chair, Parent, or Admin
        if (req.role == "T") {
            // Get offered course related to offered course code provided
            const offeredCourse = await getOfferedCourseById(offeredCourseCode);

            // Check if teacher does NOT teach this course
            if (offeredCourse.userId != req.userID) {
                return res
                    .status(403)
                    .json({
                        Message: "Only teacher associated with this course can check attendance details",
                    });
            }
        } else if (req.role == "C") {
            const offeredCourse = await getOfferedCourseById(offeredCourseCode);
            const course = await getCourseById(offeredCourse.courseCode);
            const chair = await getTeacherByUserId(req.userID);

            // Check if this course is NOT in the same department as the chair
            if (chair.depId != course.depId) {
                return res
                    .status(403)
                    .json({ Message: "this course is not in your department" });
            }
        } else if (req.role == "P") {
            const offeredCourse = await getOfferedCourseById(offeredCourseCode);
            const course = await getCourseById(offeredCourse.courseCode);
            const parent = await getParentByUserId(req.userID);

            // Decrypt the courses
            const decryptedAttendances = await Promise.all(
                attendanceList.map(async(attendance) => {
                    const student = await getStudentByUserId(attendance.userId);

                    // Return only courses which belong to parent's student child
                    if (student.userId == parent.studentUserId) {
                        return {
                            CourseCode: await Des.dencrypt(course.courseCode),
                            date: await Des.dencrypt(attendance.date),
                            isPresent: await Des.dencrypt(attendance.isPresent),
                            studentId: await Des.dencrypt(student.studentId),
                        };
                    }
                })
            );
            return res.json(
                decryptedAttendances.filter((element) => element != null)
            );
        } else if (req.role == "S") {
            const offeredCourse = await getOfferedCourseById(offeredCourseCode);
            const course = await getCourseById(offeredCourse.courseCode);
            const studente = await getStudentByUserId(req.userID);

            // Decrypt the courses
            const decryptedAttendances = await Promise.all(
                attendanceList.map(async(attendance) => {
                    const student = await getStudentByUserId(attendance.userId);
                    if (student != null) {
                        // Return only courses which belong to parent's student child
                        if (student.studentId == studente.studentId) {
                            return {
                                CourseCode: await Des.dencrypt(course.courseCode),
                                date: await Des.dencrypt(attendance.date),
                                isPresent: await Des.dencrypt(attendance.isPresent),
                                studentId: await Des.dencrypt(studente.studentId),
                            };
                        }
                    }
                })
            );
            return res.json(
                decryptedAttendances.filter((element) => element != null)
            );
        } else if (req.role != "A") {
            return res
                .status(403)
                .send({
                    Message: "Only admin, chairs, and teachers are allowed to check the attendance of the students",
                });
        }

        // Decrypt the attendances and return them
        const decryptedAttendances = await getDecryptedAttendances(attendanceList);
        return res.json(decryptedAttendances);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Message: "Something went wrong" });
    }
};

const createAttendanceController = async(req, res) => {
    try {
        const body = req.body;
        const offeredCourseID = await Des.encrypt(req.params.offeredCourseID);

        // Check if the role is neither Admin nor Teacher
        if (req.role != "A" && req.role != "T") {
            return res
                .status(403)
                .send({ Message: "Only a teacher and admin can add new attendance" });
        }

        // Check if role is Teacher
        if (req.role == "T") {
            const offeredCourse = await getOfferedCourseById(offeredCourseID);

            // Check if teacher does NOT teach this course
            if (offeredCourse.userId != req.userID) {
                return res
                    .status(403)
                    .send({
                        Message: "Only teacher teaches this course can add new attendance",
                    });
            }
        }

        const student = await getStudentByStdId(await Des.encrypt(body.studentId));

        // Create new attendance for a student and encrypt it's information
        const attendance = await Attendance.create({
            offeredCourseCode: offeredCourseID,
            date: await Des.encrypt(req.body.date.toString()),
            isPresent: await Des.encrypt(body.isPresent),
            userId: student.userId,
        });
        await attendance.save();
        return res.status(200).send({ Message: "Attendance added" });
    } catch (error) {
        console.log(error);
        return res.status(503).send({ Message: "Something went wrong" });
    }
};

const updateAttendanceInformationController = async(req, res) => {
    try {
        // Check if role is neither Admin nor Teacher
        if (req.role != "A" && req.role != "T") {
            return res
                .status(403)
                .send({ Message: "you are not allowed to update the course" });
        }

        // Encrypt course id given in URL
        const offeredCourseID = await Des.encrypt(req.params.offeredCourseID);

        // Get date and student by provided body data
        const date = await Des.encrypt(req.body.date);
        const student = await getStudentByStdId(
            await Des.encrypt(req.body.studentId)
        );

        // Check if role is Teacher
        if (req.role == "T") {
            const offeredCourse = await getOfferedCourseById(offeredCourseID);

            // Check if teacher does NOT offer this course
            if (offeredCourse.userId != req.userID) {
                return res.status(403).send({ Message: "you don't offer this course" });
            }
        }

        // Define varuable to change, decrypt body value and assign it
        const value = await Des.encrypt(req.body.value);
        const varName = req.body.varName;
        const newData = {};
        newData[varName.toString()] = value;

        // Update attenadnce information
        const status = await Attendance.update(newData, {
            where: {
                offeredCourseCode: offeredCourseID,
                date: date,
                userId: student.userId,
            },
        });
        return res.status(200).json(status == 1);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Message: "Something went wrong" });
    }
};

const deleteAttendanceController = async(req, res) => {
    try {
        if (req.role == "A" || req.role == "T") {
            const offeredCourseID = await Des.encrypt(req.params.offeredCourseID);
            const date = await Des.encrypt(req.body.date);
            const student = await getStudentByStdId(
                await Des.encrypt(req.body.studentId)
            );
            if (req.role == "T") {
                const offeredCourse = await getOfferedCourseById(offeredCourseID);
                if (offeredCourse.userId != req.userID) {
                    return res
                        .status(403)
                        .send({ Message: "you don't offer this course" });
                }
            }

            const status = await Attendance.destroy({
                where: {
                    offeredCourseCode: offeredCourseID,
                    date: date,
                    userId: student.userId,
                },
            });

            return res.status(200).json(status == 1);
        }

        return res
            .status(403)
            .send({ Message: "you are not allowed to delete the course" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ Message: "Something went wrong" });
    }
};

module.exports = {
    listAttendanceController,
    createAttendanceController,
    updateAttendanceInformationController,
    deleteAttendanceController,
};
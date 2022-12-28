const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const { getOfferedCourseById } = require('../managers/courses')
const { getTeacherByEmployeeId, getTeacherByUserId } = require('../managers/teachers')
const {
    getStudentCourseByOffCourseId,
    getAllStudentsById,
    getDecryptedStudents,
    getAllStudentsByDepId,
    getStudentByUserId,
    createNewEncryptedStudent,
    getStudentByStdId,
    getDecryptedStudent
} = require('../managers/students')
const { getParentByUserId } = require('../managers/parents')
const User = require("../models/User");


const listStudentsController = async(req, res) => {

    try {

        if (req.role == "T") {

            const offeredCourseID = req.body.offered_course;

            if (!offeredCourseID) {
                return res
                    .status(400)
                    .send({ Message: "Offered course id must be provided in the URL" });
            }

            const offeredCourse = await getOfferedCourseById(offeredCourseID)
            const teacherOfferedCourseId = await Des.encrypt(offeredCourse.employeeId)
            const teacher = await getTeacherByEmployeeId(teacherOfferedCourseId)

            if (teacher.userId != (await Des.encrypt(req.userID))) {
                return res.status(403).send({
                    Message: "Only teachers associated with this course can view its students",
                });
            }

            const studentCoursesId = await getStudentCourseByOffCourseId(offeredCourse.offeredCourseCode)
            const students = await getAllStudentsById(studentCoursesId.studentId)
            const decryptedStudents = await getDecryptedStudents(students)

            return res.json(decryptedStudents);


        } else if (req.role == "C") {

            const teacher = await getTeacherByEmployeeId(req.userID)
            const students = await getAllStudentsByDepId(teacher.depId)
            const decryptedStudents = await getDecryptedStudents(students)

            return res.json(decryptedStudents);

        } else if (req.role == "A") {

            const students = await Student.findAll();
            const decryptedStudents = await getDecryptedStudents(students)

            return res.json(decryptedStudents);

        } else {
            return res.status(403).send({
                Message: "Only teachers, chairs, and admin can view students",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(503).send({ Message: "Something went wrong" });
    }
};



const createStudentController = async(req, res) => {

    const body = req.body;

    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can add new student" });
        }
        const userId = await Des.encrypt(body.userId);

        let user = await getStudentByUserId(userId)

        if (user === null) {
            user = await getTeacherByUserId(userId)
        }
        if (user === null) {
            user = await getParentByUserId(userId)
        }
        if (user === null) {
            user = await User.findOne({
                where: {
                    userId: userId,
                },
            });
        }

        if (user != null) {
            return res.status(403).send({ Message: "This username/userId already exists" });
        }

        const student = await createNewEncryptedStudent(body);
        await student.save();

        return res.status(200).send({ Message: "New student added" });

    } catch (error) {
        console.log(error);
        return res.status(503).send({ Message: "Something went wrong" });
    }
};



const getStudentDetailController = async(req, res) => {

    const queryParams = req.params;

    try {
        if (req.role == "C") {

            const teacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });

            const studentId = await Des.encrypt(queryParams.studentID);
            const student = await getStudentByStdId(studentId);

            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Only chair associated with this department can view the student information",
                });
            }
            const decryptedStudent = await getDecryptedStudent(student)
            return res.json(decryptedStudent);

        } else if (req.role == "P") {

            const parent = await getParentByUserId(req.userId)
            const studentId = await Des.encrypt(queryParams.studentID);

            if (studentId != parent.studentId) {

                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }

            const student = await getStudentByStdId(studentId)
            const decryptedStudent = await getDecryptedStudent(student)

            return res.json(decryptedStudent);

        } else if (req.role == "S") {

            const student = await getStudentByUserId(req.userID)
            const studentId = await Des.encrypt(queryParams.studentID);

            if (studentId != student.studentId) {

                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }

            const decryptedStudent = await getDecryptedStudent(student);
            return res.json(decryptedStudent);

        } else if (req.role == "A") {

            const studentId = await Des.encrypt(req.params.studentID);
            const student = await getStudentByStdId(studentId)

            const decryptedStudent = await getDecryptedStudent(student);
            return res.json(decryptedStudent);

        } else {
            return res.status(403).send({
                Message: "Only chair, parents, and admin can view student information",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const updateStudentInformationController = async(req, res) => {

    const value = req.body.value;
    const varName = req.body.varName;
    const studentId = await Des.encrypt(req.params.studentID);

    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can update student information" });
        }

        const newData = {};
        let newValue = await Des.encrypt(value);
        if (varName.toString() == "password") {
            newValue = await Des.encrypt(await PasswordManager.hashPassword(value));
        }
        newData[varName.toString()] = newValue;

        if (varName.toString() == "userId") {

            let user = await getStudentByUserId(newValue)

            if (user === null) {
                user = await getTeacherByUserId(newValue)
            }
            if (user === null) {
                user = await getParentByUserId(newValue)
            }
            if (user === null) {
                user = await User.findOne({
                    where: {
                        userId: newValue,
                    },
                });
            }
            if (user != null) {
                return res.status(403).send({ Message: "someone took this username" });
            }
        }
        const student = await Student.update(newData, {
            where: {
                studentId: studentId,
            },
        });

        return res.json(student[0] === 1);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const deleteStudentController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can delete student information" });
        }

        const studentId = await Des.encrypt(req.params.studentID);

        await Student.destroy({
            where: {
                studentId: studentId,
            },
        });

        return res.status(201).send({ Message: "Student information deleted" });
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



module.exports = {
    listStudentsController,
    createStudentController,
    getStudentDetailController,
    updateStudentInformationController,
    deleteStudentController,
};
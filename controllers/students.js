const Student = require("../models/Student");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const { getOfferedCourseById } = require('../managers/courses')
const { getTeacherByUserId } = require('../managers/teachers')
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
const { checkUsernameIsTaken } = require('../managers/general')
const { getParentByUserId } = require('../managers/parents')



const listStudentsController = async(req, res) => {

    try {

        // Check if the role is Teacher, Chair, or Admin
        if (req.role == "T") {

            // encrypt offered course id provided in body
            const offeredCourseID = await Des.encrypt(req.body.offered_course);

            // Check if it's not provided, send a message
            if (!offeredCourseID) {
                return res
                    .status(400)
                    .send({ Message: "Offered course id must be provided in the URL" });
            }

            // Get offered course, and get teacher that teaches this offered course
            const offeredCourse = await getOfferedCourseById(offeredCourseID);
            const teacher = await getTeacherByUserId(offeredCourse.userId);

            // Check if the user is NOT the teacher 
            if (teacher.userId != req.userID) {
                return res.status(403).send({
                    Message: "Only teachers associated with this course can view its students",
                });
            }

            const studentCoursesId = await getStudentCourseByOffCourseId(offeredCourse.offeredCourseCode);

            // Get students associated with this course, decrypt them, and send as a response
            const students = await getAllStudentsById(studentCoursesId.studentId);
            const decryptedStudents = await getDecryptedStudents(students);
            return res.json(decryptedStudents);


        } else if (req.role == "C") {


            const teacher = await getTeacherByUserId(req.userID);

            // Get students with the department as the user/chair, decrypt, and send
            const students = await getAllStudentsByDepId(teacher.depId);
            const decryptedStudents = await getDecryptedStudents(students);
            return res.json(decryptedStudents);

        } else if (req.role == "A") {

            // Get all students, decrypt, and return them
            const students = await Student.findAll();
            const decryptedStudents = await getDecryptedStudents(students);
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

        // Check if role not Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can add new student" });
        }

        // encrypt username/userId and check it it's taken by other user
        const userId = await Des.encrypt(body.userId);
        let usernameIsTaken = await checkUsernameIsTaken(userId);

        if (usernameIsTaken) {
            return res.status(403).send({ Message: "This username/userId already exists" });
        }

        // Create new student, decrypt, and save
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

        // Check if role is Chair, Parent, Student, or Admin
        if (req.role == "C") {

            const teacher = await getTeacherByUserId(req.userID);

            // encrypt student id provided in URL, and get student with this id
            const studentId = await Des.encrypt(queryParams.studentID);
            const student = await getStudentByStdId(studentId);

            // Check if the student is NOT in the same department as the teacher
            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Only chair associated with this department can view the student information",
                });
            }

            // Decrypt student, and return it
            const decryptedStudent = await getDecryptedStudent(student);
            return res.json(decryptedStudent);

        } else if (req.role == "P") {

            // Get parent by requested user's id, and encrypt student id provided in URL
            const parent = await getParentByUserId(req.userId);
            const studentId = await Des.encrypt(queryParams.studentID);

            // Check if students's parent is NOT the user
            if (studentId != parent.studentId) {

                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }

            // Get student, decrypt, and return it
            const student = await getStudentByStdId(studentId);
            const decryptedStudent = await getDecryptedStudent(student);
            return res.json(decryptedStudent);

        } else if (req.role == "S") {

            // Get student by requested user's id, and decrypt student id provided in URL
            const student = await getStudentByUserId(req.userID);
            const studentId = await Des.encrypt(queryParams.studentID);

            // Check if user is NOT the student
            if (studentId != student.studentId) {

                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }

            // Decrypt student, and return it 
            const decryptedStudent = await getDecryptedStudent(student);
            return res.json(decryptedStudent);

        } else if (req.role == "A") {

            // Encrypt student id, get student, decrypt it, and return
            const studentId = await Des.encrypt(req.params.studentID);
            const student = await getStudentByStdId(studentId);
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
        // Check if role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can update student information" });
        }

        // Define variable name needed to change, and the new value
        const newData = {};
        let newValue = await Des.encrypt(value);
        if (varName.toString() == "password") {
            newValue = await Des.encrypt(await PasswordManager.hashPassword(value));
        }
        newData[varName.toString()] = newValue;

        if (varName.toString() == "userId") {

            let usernameIsTaken = await checkUsernameIsTaken(newValue);
            if (usernameIsTaken) {
                return res.status(403).send({ Message: "someone took this username" });
            }
        }

        // Update student's data and send back a boolean result
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

        // Check if role is not Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can delete student information" });
        }

        const studentId = await Des.encrypt(req.params.studentID);

        // Find Student and delete it
        await Student.destroy({
            where: {
                userId: studentId,
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
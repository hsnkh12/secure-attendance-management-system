const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");

const listStudentsController = async(req, res) => {
    // const queryParams = req.query;
    try {
        // role should be provided by jwt
        if (req.body.role == "T") {
            const offeredCourseID = req.body.offered_course;

            if (!offeredCourseID) {
                return res
                    .status(400)
                    .send({ Message: "Offered course id must be provided in the URL" });
            }

            // Dummy method to get offered course related to (offered course id)
            const offeredCourse = await null;

            if (offeredCourse.teacherId != req.userID) {
                return res.status(403).send({
                    Message: "Only teachers associated with this course can view its students",
                });
            }

            // Get all students related to (offered course id)
            const students = await null;

            return res.json(students);
        } else if (req.body.role == "C") {
            // const teacherId = await Des.encrypt("10");

            // const depId = await Student.findbypk(teacherId).depId;

            const depId = "CMSE";
            const students = await Student.findAll({
                where: {
                    depid: await Des.encrypt(depId),
                },
            });
            const transformedUsers = await Promise.all(
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

            return res.json(transformedUsers);
        } else if (req.body.role == "A") {
            const students = await Student.findAll();
            const transformedUsers = await Promise.all(
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

            return res.json(transformedUsers);
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
        if (body.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can add new student" });
        }

        // Create new student instance and save it
        const student = await Student.create({
            firstName: await Des.encrypt(body.firstName),
            lastName: await Des.encrypt(body.lastName),
            studentId: await Des.encrypt(body.studentId),
            email: await Des.encrypt(body.email),
            password: await Des.encrypt(body.password),
            role: await Des.encrypt("S"),
            dateJoined: await Des.encrypt(body.dateJoined.toString()),
            userId: await Des.encrypt(body.userId),
            depId: await Des.encrypt(body.depId),
        });
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
        const studentId = await Des.encrypt(req.userID);
        const student = await Student.findOne({
            where: {
                studentId: studentId,
            },
        });


        if (req.role == "C") {
            // Get teacher related to (user id)

            const employeeId = await Des.encrypt(req.userID);
            // Get student related to (student id)
            const teacher = await Teacher.findOne({
                where: {
                    employeeId: employeeId,
                },
            });


            // Get student related to (student id)



            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Only chair associated with this department can view the student information",
                });
            }

            return res.json(student);
        } else if (req.role == "P") {
            // Get parent related to (user id)
            /* 
                                                      after parent adder and getter

                                                      */

            return res.json(students);
        } else if (req.body.role == "A") {
            // Get student related to (student id)
            const studentId = await Des.encrypt(req.params.studentID);
            // Get student related to (student id)
            const student = await Student.findOne({
                where: {
                    studentId: studentId,
                },
            });
            const transformedUsers = await Promise.all(
                student.map(async(user) => ({
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
            return res.json(transformedUsers);
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
    console.log(varName, value);
    try {
        if (req.body.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can update student information" });
        }

        // update student information
        const newValue = await Des.encrypt(value);
        const newData = {};
        newData[varName.toString()] = newValue;
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
        if (req.body.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can delete student information" });
        }

        const studentId = await Des.encrypt(req.params.studentID);
        // delete student
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
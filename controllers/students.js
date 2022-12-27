const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const OfferedCourse = require("../models/OfferedCourse");
const StudentCourse = require("../models/StudentCourse");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const User = require("../models/User");

const listStudentsController = async(req, res) => {
    // const queryParams = req.query;
    try {
        // role should be provided by jwt
        if (req.role == "T") {
            const offeredCourseID = req.body.offered_course;

            if (!offeredCourseID) {
                return res
                    .status(400)
                    .send({ Message: "Offered course id must be provided in the URL" });
            }

            const offeredCourse = OfferedCourse.findOne({
                where: {
                    offeredCourseCode: await Des.encrypt(offeredCourseID),
                },
            });
            const teacher = Teacher.findOne({
                where: {
                    employeeId: offeredCourse.employeeId,
                },
            });

            if (teacher.userId != (await Des.encrypt(req.userID))) {
                return res.status(403).send({
                    Message: "Only teachers associated with this course can view its students",
                });
            }

            // Get all students related to (offered course id)
            const studentCoursesId = await StudentCourse.findAll({
                where: {
                    offeredCourseCode: offeredCourse.offeredCourseCode,
                },
            });
            const students = await Student.findAll({
                where: {
                    studentId: studentCoursesId.studentId,
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
        } else if (req.role == "C") {
            const teacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });
            const students = await Student.findAll({
                where: {
                    depid: teacher.depId,
                },
            });

            const transformedUsers = await Promise.all(
                students.map(async(user) => ({
                    userId: await Des.dencrypt(user.userId),
                    email: await Des.dencrypt(user.email),
                    firstName: await Des.dencrypt(user.firstName),
                    lastName: await Des.dencrypt(user.lastName),
                    studentId: await Des.dencrypt(user.studentId),
                    depId: await Des.dencrypt(user.depId),
                }))
            );

            return res.json(transformedUsers);
        } else if (req.role == "A") {
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
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can add new student" });
        }
        const UserID = await Des.encrypt(body.userId);

        // Create new teacher
        let user = await Student.findOne({
            where: {
                userId: UserID,
            },
        });
        if (user === null) {
            user = await Teacher.findOne({
                where: {
                    userId: UserID,
                },
            });
        }
        if (user === null) {
            user = await Parent.findOne({
                where: {
                    userId: UserID,
                },
            });
        }
        if (user === null) {
            user = await User.findOne({
                where: {
                    userId: UserID,
                },
            });
        }
        if (user != null) {
            return res.status(403).send({ Message: "someone took this username" });
        }

        // Create new student instance and save it
        const student = await Student.create({
            firstName: await Des.encrypt(body.firstName),
            lastName: await Des.encrypt(body.lastName),
            studentId: await Des.encrypt(body.studentId),
            email: await Des.encrypt(body.email),
            password: await Des.encrypt(
                await PasswordManager.hashPassword(body.password)
            ),
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
        if (req.role == "C") {
            const teacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });

            const studentId = await Des.encrypt(queryParams.studentID);
            const student = await Student.findOne({
                where: {
                    studentId: studentId,
                },
            });

            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Only chair associated with this department can view the student information",
                });
            }
            const transformedUser = {
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
            return res.json(transformedUser);
        } else if (req.role == "P") {
            // get the parent
            const parent = await Parent.findOne({
                where: {
                    userid: req.userID,
                },
            });
            const student = await Student.findOne({
                where: {
                    studentId: studentId,
                },
            });
            // check if its the parent
            const studentId = await Des.encrypt(queryParams.studentID);

            if (studentId == parent.studentId) {
                const student = await Student.findOne({
                    where: {
                        StudentId: studentId,
                    },
                });
                const transformedUser = {
                    userId: await Des.dencrypt(student.userId),
                    email: await Des.dencrypt(student.email),
                    firstName: await Des.dencrypt(student.firstName),
                    lastName: await Des.dencrypt(student.lastName),
                    dateOfBirth: await Des.dencrypt(student.dateOfBirth),
                    studentId: await Des.dencrypt(student.studentId),
                    currentCredits: await Des.dencrypt(student.currentCredits),
                    pastCredits: await Des.dencrypt(student.pastCredits),
                    CGPA: await Des.dencrypt(student.CGPA),
                    GPA: await Des.dencrypt(student.GPA),
                    depId: await Des.dencrypt(student.depId),
                };
                return res.json(transformedUser);
            } else {
                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }
        } else if (req.role == "S") {
            const student = await Student.findOne({
                where: {
                    userid: req.userID,
                },
            });

            const studentId = await Des.encrypt(queryParams.studentID);
            if (studentId == student.studentId) {
                const student = await Student.findOne({
                    where: {
                        StudentId: studentId,
                    },
                });
                const transformedUser = {
                    userId: await Des.dencrypt(student.userId),
                    email: await Des.dencrypt(student.email),
                    firstName: await Des.dencrypt(student.firstName),
                    lastName: await Des.dencrypt(student.lastName),
                    dateOfBirth: await Des.dencrypt(student.dateOfBirth),
                    studentId: await Des.dencrypt(student.studentId),
                    currentCredits: await Des.dencrypt(student.currentCredits),
                    pastCredits: await Des.dencrypt(student.pastCredits),
                    CGPA: await Des.dencrypt(student.CGPA),
                    GPA: await Des.dencrypt(student.GPA),
                    depId: await Des.dencrypt(student.depId),
                };
                return res.json(transformedUser);
            } else {
                return res.status(403).send({
                    Message: "You can only check info of your student",
                });
            }
        } else if (req.role == "A") {
            // Get student related to (student id)
            const studentId = await Des.encrypt(req.params.studentID);
            // Get student related to (student id)
            const student = await Student.findOne({
                where: {
                    studentId: studentId,
                },
            });
            const transformedUser = {
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
            return res.json(transformedUser);
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

        // update student information
        const newData = {};
        let newValue = await Des.encrypt(value);
        if (varName.toString() == "password") {
            newValue = await PasswordManager.hashPassword(value);
        }
        newData[varName.toString()] = newValue;
        // finding user
        if (varName.toString() == "userId") {
            let user = await Student.findOne({
                where: {
                    userId: newValue,
                },
            });
            if (user === null) {
                user = await Teacher.findOne({
                    where: {
                        userId: newValue,
                    },
                });
            }
            if (user === null) {
                user = await Parent.findOne({
                    where: {
                        userId: newValue,
                    },
                });
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
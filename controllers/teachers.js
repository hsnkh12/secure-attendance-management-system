const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const Parent = require("../models/Parent");
const User = require("../models/User");

const listTeachersController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to view teachers information",
            });
        }
        const teachers = await Teacher.findAll();
        const transformedUsers = await Promise.all(
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
        return res.json(transformedUsers);
        // Get all teachers
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const createTeacherController = async(req, res) => {
    const body = req.body;
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to add new teacher" });
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
        if (body.Urole == "T" || body.Urole == "C") {
            const teacher = await Teacher.create({
                firstName: await Des.encrypt(body.firstName),
                lastName: await Des.encrypt(body.lastName),
                employeeId: await Des.encrypt(body.employeeId),
                email: await Des.encrypt(body.email),
                password: await Des.encrypt(
                    await PasswordManager.hashPassword(body.password)
                ),
                role: await Des.encrypt(body.Urole),
                dateJoined: await Des.encrypt(body.dateJoined.toString()),
                userId: UserID,
                depId: await Des.encrypt(body.depId),
            });
            await teacher.save();
            return res.status(200).send({ Message: "New Teacher added" });
        } else {
            return res.json({ Message: "role should be T or C" });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const getTeacherDetailController = async(req, res) => {
    try {
        // Get teacher related to ( teacher id )

        if (req.role == "T") {
            const teacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });
            // Check if teacher is himself (I dont have other explanation tbh ;) )
            if (req.userID != teacher.userId) {
                return res.status(403).send({
                    Message: "Teacher is not allowed to view other teacher's information",
                });
            }
            const transformedUser = {
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
            return res.json(transformedUser);
        } else if (req.role == "A") {
            const depId = await Des.encrypt(req.params.departmentID);
            // Get student related to (student id)
            const teachers = await Teacher.findAll({
                where: {
                    depId: depId,
                },
            });
            const transformedUsers = await Promise.all(
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
            return res.json(transformedUsers);
        } else if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher can view teacher information",
            });
        }

        return res.json(teacher);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const getTeacherInfoController = async(req, res) => {
    try {
        if (req.role == "P") {
            return res.status(403).send({
                Message: "Parent cannot check teacher information",
            });
        }

        // Get teacher realated to teacher id
        const teacher = await Teacher.findOne({
            where: {
                employeeId: await Des.encrypt(req.params.employeeId),
            },
        });

        if (req.role == "T") {
            // if teacher is not the teacher
            const thisTeacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });
            if (thisTeacher.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Teacher is not allowed to view other teacher's information in other department",
                });
            }
            // Check if teacher is himself (I dont have other explanation tbh ;) )

            const transformedUser = {
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
            return res.json(transformedUser);
        } else if (req.role == "C") {
            const employeeId = await Des.encrypt(req.params.employeeId);
            // Get student related to (student id)
            const chair = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });

            if (chair.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "You can only check info of Teacher in your department",
                });
            }
            const transformedUser = {
                userId: await Des.dencrypt(teacher.userId),
                email: await Des.dencrypt(teacher.email),
                firstName: await Des.dencrypt(teacher.firstName),
                lastName: await Des.dencrypt(teacher.lastName),
                dateOfBirth: await Des.dencrypt(teacher.dateOfBirth),
                employeeId: await Des.dencrypt(teacher.employeeId),
                depId: await Des.dencrypt(teacher.depId),
            };
            return res.json(transformedUser);
        } else if (req.role == "S") {
            const employeeId = await Des.encrypt(req.params.employeeId);
            // Get student related to (student id)
            const student = await Student.findOne({
                where: {
                    userId: req.userID,
                },
            });
            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "You can only check info of Teacher in your department",
                });
            }
            const transformedUser = {
                firstName: await Des.dencrypt(teacher.firstName),
                lastName: await Des.dencrypt(teacher.lastName),
                email: await Des.dencrypt(teacher.email),
            };
            return res.json(transformedUser);
        } else {
            const transformedUser = {
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
            return res.json(transformedUser);
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const updateTeacherInformationController = async(req, res) => {
    const body = req.body;

    try {
        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to update teacher information",
            });
        }
        const value = req.body.value;
        const varName = req.body.varName;
        const employeeId = await Des.encrypt(req.params.employeeId);
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

        const teacher = await Teacher.update(newData, {
            where: {
                employeeId: employeeId,
            },
        });

        return res.json(teacher[0] === 1);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const deleteTeacherController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can delete teacher information" });
        }

        // get the teacher
        const status = await Teacher.destroy({
            where: {
                employeeId: await Des.encrypt(req.params.employeeId),
            },
        });
        if (status) {
            return res.status(201).send({ Message: "Teacher information deleted" });
        } else {
            return res.status(400).send({ Message: "there wasn't any users with this info" });
        }
    } catch (error) {
        console.log(error);
        return res.status(503).send({ Message: "Something went wrong" });
    }
};

module.exports = {
    listTeachersController,
    createTeacherController,
    getTeacherDetailController,
    updateTeacherInformationController,
    deleteTeacherController,
    getTeacherInfoController,
};
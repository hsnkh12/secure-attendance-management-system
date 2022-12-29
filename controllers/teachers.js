const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const { 
    getDecryptedTeachers, 
    getTeacherByEmployeeId, 
    getTeacherByUserId, 
    createNewEncryptedTeacher, 
    getDecryptedTeacher,
    getAllTeachersBydepId
} = require('../managers/teachers')
const { getStudentByUserId } = require('../managers/students')
const {checkUsernameIsTaken} = require('../managers/general')


const listTeachersController = async(req, res) => {

    try {

        // Check the role of the user if it's not Admin
        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to view teachers information",
            });
        }

        // Get all teachers and decrypt them
        const teachers = await Teacher.findAll();
        const decryptedTeachers = await getDecryptedTeachers(teachers);

        return res.json(decryptedTeachers);
        
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const createTeacherController = async(req, res) => {

    const body = req.body;

    try {

        // Check the role of the user if it's not Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to add new teacher" });
        }

        // Get username added in body and check of it's taken by other user
        const userId = await Des.encrypt(body.userId);
        let usernameIsTaken = await checkUsernameIsTaken(userId);

        // Check if it's already taken
        if (usernameIsTaken) {
            return res.status(403).send({ Message: "someone took this username" });
        }

        // Check if role added in body if its either a teacher or chair
        if (body.Urole == "T" || body.Urole == "C") {

            // Create, encrypt, and save the new teacher
            const teacher = await createNewEncryptedTeacher(body,userId);
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



const getTeachersInDepartmentController = async(req, res) => {

    try {
        
        // Check if the role is either Admin
        if (req.role == "A") {

            // encrypt department id provided in URL
            const depId = await Des.encrypt(req.params.departmentID);

            // Get, decrypt, and return teachers in the department of depId
            const teachers = await getAllTeachersBydepId(depId);
            const decryptedTeachers = await getDecryptedTeachers(teachers);
            return res.json(decryptedTeachers);

        } else {
            return res.status(403).send({
                Message: "Only Admin and teacher can view teacher information",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const getTeacherInfoController = async(req, res) => {

    try {

        // Check if the role is parent
        if (req.role == "P") {
            return res.status(403).send({
                Message: "Parent cannot check teacher information",
            });
        }

        // encrypt employeeId and get teacher with this decrypted employeeId
        const employeeId = await Des.encrypt(req.params.employeeId);
        const teacher = await getTeacherByEmployeeId(employeeId);

        // Check if role is Teacher, Chair, Student, or Admin
        if (req.role == "T") {
            
            const thisTeacher = await getTeacherByUserId(req.userID);

            // Check if requested user's department is NOT the same as teacher's
            if (thisTeacher.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Teacher is not allowed to view other teacher's information in other department",
                });
            }

            // Decrypt teacher and return it
            const decryptedTeacher = await getDecryptedTeacher(teacher);
            return res.json(decryptedTeacher);

        } else if (req.role == "C") {

            const chair = await getTeacherByUserId(req.userID);

            // Check if the chair is NOT in the same department as the teacher
            if (chair.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "You can only check info of Teacher in your department",
                });
            }

            // Decrypt teacher and return it
            const decryptedTeacher = await getDecryptedTeacher(chair);
            return res.json(decryptedTeacher);

        } else if (req.role == "S") {

            const student = await getStudentByUserId(req.userID)

            // Check if student's department is the same as the teacher's
            if (student.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "You can only check info of Teacher in your department",
                });
            }

            // Decrypt teacher and return it
            const decryptedTeacher = {
                firstName: await Des.dencrypt(teacher.firstName),
                lastName: await Des.dencrypt(teacher.lastName),
                email: await Des.dencrypt(teacher.email),
            };
            return res.json(decryptedTeacher);

        } else {

            // Decrypt teacher and return it
            const decryptedTeacher = await getDecryptedTeacher(teacher);
            return res.json(decryptedTeacher);
        }
        
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const updateTeacherInformationController = async(req, res) => {

    const body = req.body;

    try {

        // Check if the role is NOT Admin
        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to update teacher information",
            });
        }

        // Define variable name needed to change, and the new value
        const value = req.body.value;
        const varName = req.body.varName;
        const employeeId = await Des.encrypt(req.params.employeeId);
        const newData = {};

        let newValue = await Des.encrypt(value);

        // Check if variable name is passowrd and hash it
        if (varName.toString() == "password") {
            newValue = await Des.encrypt(await PasswordManager.hashPassword(value));
        }

        // Assign the new data 
        newData[varName.toString()] = newValue;
        
        // Check if the value needed to change is userId, and check if it's taken
        if (varName.toString() == "userId") {

            let usernameIsTaken = await checkUsernameIsTaken(newValue);
            if (usernameIsTaken) {
                return res.status(403).send({ Message: "someone took this username" });
            }
        }

        // Update teacher's data and send back a boolean result
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

        // Check if role is not a Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can delete teacher information" });
        }

        // Find teacher and delete it
        const status = await Teacher.destroy({
            where: {
                employeeId: await Des.encrypt(req.params.employeeId),
            },
        });

        // Check the status of the delete
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
    getTeachersInDepartmentController,
    updateTeacherInformationController,
    deleteTeacherController,
    getTeacherInfoController,
};
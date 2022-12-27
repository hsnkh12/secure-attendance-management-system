const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");

const listTeachersController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({
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

        // Create new teacher
        if (body.Urole == "T" || body.Urole == "C") {
            const teacher = await Teacher.create({
                firstName: await Des.encrypt(body.firstName),
                lastName: await Des.encrypt(body.lastName),
                employeeId: await Des.encrypt(body.employeeId),
                email: await Des.encrypt(body.email),
                password: await Des.encrypt(body.password),
                role: await Des.encrypt("T"),
                dateJoined: await Des.encrypt(body.dateJoined.toString()),
                userId: await Des.encrypt(body.userId),
                depId: await Des.encrypt(body.depId),
            });
            await teacher.save();
            return res.json(teacher);
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
            // Check if teacher is himself (I dont have other explanation tbh ;) )
            if (!req.userID == teacher.id) {
                return res
                    .status(403)
                    .send({
                        Message: "Teacher is not authorized to view other teacher's information",
                    });
            }
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
            return res
                .status(403)
                .send({
                    Message: "Only Admin and teacher can view teacher information",
                });
        }

        return res.json(teacher);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};


const getTeacherInfoController = async (req, res) => {

    try{

        if (req.role == 'P'){

            return res
                .status(403)
                .send({
                    Message: "Parent cannot check teacher information",
                });

        }

        // Get teacher realated to teacher id
        const teacher = await null
        
        if (req.role == 'T'){

            // if teacher is not the teacher 
            if(req.userID != teacher.employeeId){

                return res
                .status(403)
                .send({
                    Message: "ITS NOT YOU",
                });

            }

        } else if (req.role == 'C'){

            // If the chair is not in the department
            

        } else if (req.role == 'S'){

            // If student not in the same course 

            // Return firstname lastname email and department
            return res.json()

        } 

        return res.json(teacher)

    }
    catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
}

const updateTeacherInformationController = async(req, res) => {
    const body = req.body;

    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({
                    Message: "Only Admin is authorized to update teacher information",
                });
        }
        const value = req.body.value;
        const varName = req.body.varName;
        const employeeId = await Des.encrypt(req.params.employeeId);
        const newValue = await Des.encrypt(value);
        const newData = {};
        newData[varName.toString()] = newValue;
        console.log(varName, value);
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
        const student = await null;
        // delete the teacher
        await student.delete();

        return res.status(201).send({ Message: "Teacher information deleted" });
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

module.exports = {
    listTeachersController,
    createTeacherController,
    getTeacherDetailController,
    updateTeacherInformationController,
    deleteTeacherController,
    getTeacherInfoController
};
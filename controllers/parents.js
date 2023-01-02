const { getStudentByStdId, getStudentByUserId } = require("../managers/students");
const Parent = require("../models/Parent");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");
const {
    getDecryptedParents, 
    getParentByUserId, 
} = require('../managers/parents')
const {checkUsernameIsTaken} = require('../managers/general')



const listParentsController = async(req, res) => {

    try {

        // Check if role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin is authorized to view parents" });
        }

        // Get all parents, decrypt them, and return them
        const parents = await Parent.findAll();
        const transformedUsers = await getDecryptedParents(parents);
        return res.json(transformedUsers);

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const createParentController = async(req, res) => {
    const body = req.body;

    try {
        
        // Check if role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin is authorized to add new parent" });
        }
        const userId = await Des.encrypt(body.userId);

        // Check if usrename/userId is already taken by other user
        let usernameIsTaken = await checkUsernameIsTaken(userId);
        if (usernameIsTaken) {
            return res.status(403).send({ Message: "someone took this username" });
        }

        let student = null;

        // Get and check student with given student if he/she exists
        student = await getStudentByStdId(await Des.encrypt(body.studentId));
        if (student == null) {
            // Otherwise, create an empty user with null userId
            student = {
                userId: null
            }
        }

        // Create parent, encrypt, save, and return it
        const parent = await Parent.create({
            firstName: await Des.encrypt(body.firstName),
            lastName: await Des.encrypt(body.lastName),
            studentUserId: student.userId,
            email: await Des.encrypt(body.email),
            password: await Des.encrypt(
                await PasswordManager.hashPassword(body.password)
            ),
            role: await Des.encrypt("P"),
            dateJoined: await Des.encrypt(body.dateJoined.toString()),
            dateOfBirth: await Des.encrypt(body.dateOfBirth.toString()),
            userId: await Des.encrypt(body.userId),
        });
        await parent.save();
        
        return res.status(200).send({ Message: "New parent added" });

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const getParentDetailController = async(req, res) => {

    const userId = await Des.encrypt(req.params.userid);
    const parent = await getParentByUserId(userId);

    let student = null;
    student = await getStudentByUserId(parent.studentUserId);
    if (student == null) {
        student = {
            studentId: null
        }

    }
    const transformedUser = {
        userId: await Des.dencrypt(parent.userId),
        email: await Des.dencrypt(parent.email),
        firstName: await Des.dencrypt(parent.firstName),
        lastName: await Des.dencrypt(parent.lastName),
        dateJoined: await Des.dencrypt(parent.dateJoined),
        lastLogin: await Des.dencrypt(parent.lastLogin),
        dateOfBirth: await Des.dencrypt(parent.dateOfBirth),
        studentId: await Des.dencrypt(student.studentId),
    };
    if (req.role == "A") {
        return res.json(transformedUser);
    }
    if (req.role == "P") {
        if (req.userID == parent.userId) {
            return res.json(transformedUser);
        }
    }
    
    return res
        .status(403)
        .send({ Message: "Only admin is see parents details" });

};



const updateParentController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin can update student information" });
        }
        if (req.role == "A") {

            const value = req.body.value;
            const varName = req.body.varName;
            console.log(req.params.userid);
            const userId = await Des.encrypt(req.params.userid);
            let newData = {};
            let newValue = await Des.encrypt(value);
            if (varName.toString() == "password") {
                newValue = await PasswordManager.hashPassword(value);
            }
            newData[varName.toString()] = newValue;
            // finding user
            if (varName.toString() == "userId") {

                let usernameIsTaken = await checkUsernameIsTaken(newValue);
                if (usernameIsTaken) {
                    return res
                        .status(403)
                        .send({ Message: "someone took this username" });
                }
            }
            if (varName.toString() == "studentId") {
                let student = null;
                student = await getStudentByStdId(newValue)
                if (student == null) {
                    return res.status(404).send({
                        Message: "student Id not found",
                    });
                }
                newData = {};
                newData["studentUserId"] = student.userId;
                console.log(newData);
            }
            const parent = await Parent.update(newData, {
                where: {
                    userId: userId,
                },
            });

            if (parent[0] === 1) {
                return res.json({ Message: "Updated" });
            } else {
                return res.status(403).send({
                    Message: "not Updated",
                });
            }
        } else {
            return res.status(403).send({
                Message: "Only admin and parent authorized to update a parent",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const deleteParentController = async(req, res) => {
    try {

        // Check if the role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin is authorized to remove a parent" });
        }

        // Get parent by id
        const parentId = await Des.encrypt(req.params.userid);
        // delete student
        await Parent.destroy({
            where: {
                userId: parentId,
            },
        });

        return res.status(201).send({ Message: "Parent information deleted" });

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

module.exports = {
    listParentsController,
    createParentController,
    getParentDetailController,
    deleteParentController,
    updateParentController,
};
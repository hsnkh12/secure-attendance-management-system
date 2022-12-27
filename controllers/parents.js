const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");

const listParentsController = async(req, res) => {
    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin is authorized to view parents" });
        }

        // Get all parents
        const parents = await Parent.findAll();

        const transformedUsers = await Promise.all(
            parents.map(async(user) => ({
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
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const createParentController = async(req, res) => {
    const body = req.body;

    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only admin is authorized to add new parent" });
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
        // create new parent
        const parent = await Parent.create({
            firstName: await Des.encrypt(body.firstName),
            lastName: await Des.encrypt(body.lastName),
            studentId: await Des.encrypt(body.studentId),
            email: await Des.encrypt(body.email),
            password: await Des.encrypt(
                await PasswordManager.hashPassword(body.password)
            ),
            role: await Des.encrypt("P"),
            dateJoined: await Des.encrypt(body.dateJoined.toString()),
            userId: await Des.encrypt(body.userId),
        });
        await parent.save(body);
        return res.status(200).send({ Message: "New parent added" });
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const getParentDetailController = async(req, res) => {
    const userId = await Des.encrypt(req.params.userid)
    const parent = await Parent.findOne({
        where: {
            userId: userId,
        },
    });

    const transformedUser = {
        userId: await Des.dencrypt(parent.userId),
        email: await Des.dencrypt(parent.email),
        firstName: await Des.dencrypt(parent.firstName),
        lastName: await Des.dencrypt(parent.lastName),
        dateJoined: await Des.dencrypt(parent.dateJoined),
        lastLogin: await Des.dencrypt(parent.lastLogin),
        dateOfBirth: await Des.dencrypt(parent.dateOfBirth),
        studentId: await Des.dencrypt(parent.studentId),
        depId: await Des.dencrypt(parent.depId),
    };
    if (req.role == "A") {
        return res.json(transformedUser);
    }
    if (req.role == "P") {
        if (req.userID == parent.userId) {
            return res.json(transformedUser);
        }
    }
    console.log(await Des.dencrypt(req.role));
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
                    return res
                        .status(403)
                        .send({ Message: "someone took this username" });
                }
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
        // delete parent
        await parent.delete();
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
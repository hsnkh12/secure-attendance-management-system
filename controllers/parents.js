const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { Des } = require("../utils/des");
const { PasswordManager } = require("../utils/password");

const listParentsController = async(req, res) => {

    try {

        if (req.role != 'A') {
            return res.status(403).send({ 'Message': 'Only admin is authorized to view parents' })
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
        console.log(error)
        return res.status(404).send({ 'Message': 'Something went wrong' })
    }

}

const createParentController = async(req, res) => {

    const body = req.body

    try {

        if (req.role != 'A') {
            return res.status(403).send({ 'Message': 'Only admin is authorized to add new parent' })
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
            role: await Des.encrypt("S"),
            dateJoined: await Des.encrypt(body.dateJoined.toString()),
            userId: await Des.encrypt(body.userId),
        });
        await parent.save(body)
        return res.status(200).send({ Message: "New parent added" });

    } catch (error) {
        console.log(error)
        return res.status(404).send({ 'Message': 'Something went wrong' })
    }

}


const getParentDetailController = async(req, res) => {
    // No need for this, we will delete it later
}

const updateParentController = async(req, res) => {

    const body = req.body

    try {

        if (req.role == await Des.encrypt('A')) {

            // Update the parent
            return res.json({ 'Message': 'Updated' })

        } else if (req.role == await Des.encrypt('P')) {

            // Get the parent 
            const parent = await null

            // Check if the parent is the parent
            if (parent.userid == req.userID) {
                return res.status(403).send({ 'Message': 'ITS NOT YOU' })
            }

            // Update the parent
            return res.json({ 'Message': 'Updated' })

        } else {
            return res.status(403).send({ 'Message': 'Only admin and parent authorized to update a parent' })
        }

    } catch (error) {
        console.log(error)
        return res.status(404).send({ 'Message': 'Something went wrong' })
    }

}

const deleteParentController = async(req, res) => {

    try {

        if (req.role != await Des.encrypt('A')) {
            return res.status(403).send({ 'Message': 'Only admin is authorized to remove a parent' })
        }

        // Get parent by id
        const parent = await null
            // delete parent
        await parent.delete()
        return res.status(201).send({ 'Message': 'Parent information deleted' })

    } catch (error) {
        console.log(error)
        return res.status(404).send({ 'Message': 'Something went wrong' })
    }
}


module.exports = {
    listParentsController,
    createParentController,
    getParentDetailController,
    deleteParentController,
    updateParentController

}
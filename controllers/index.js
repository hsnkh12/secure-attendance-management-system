const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");

const User = require("../models/user");
const { PasswordManager } = require("../utils/password");
const jwt = require("jsonwebtoken");
const Parent = require("../models/Parent");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const indexController = async(req, res) => {
    return res.json({ Message: "home" });
};

const loginController = async(req, res) => {
    let body = req.body;
    const username = await Des.encrypt(body.username);
    const password = body.password;
    try {
        // finding user
        let user = await Student.findOne({
            where: {
                userId: username,
            },
        });
        if (user === null) {
            user = await Teacher.findOne({
                where: {
                    userId: username,
                },
            });
        }
        if (user === null) {
            user = await Parent.findOne({
                where: {
                    userId: username,
                },
            });
        }
        if (user === null) {
            user = await User.findOne({
                where: {
                    userId: username,
                },
            });
        }
        if (user != null) {
            const passwordIsValid = await PasswordManager.comparePassword(
                password,
                await Des.dencrypt(user.password)
            );

            if (passwordIsValid) {
                // Generate a jwt token for the user using his data
                const user_to_enc = { userId: user.userId, role: user.role }
                jwt.sign(user_to_enc,
                    JWT_SECRET_KEY, { expiresIn: "30m" },
                    (err, token) => {
                        return res.json({
                            token,
                        });
                    }
                );
            } else {
                return res.status(401).send({ Message: "Password incorrect" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({ Message: "Invalid credentials" });
    }
};

module.exports = {
    indexController,
    loginController,
};
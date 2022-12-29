const { Des } = require("../utils/des");
const {getUserByUserId} = require('../managers/general')
const { PasswordManager } = require("../utils/password");
const jwt = require("jsonwebtoken");
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

        // finding user by username provided in body
        let user = await getUserByUserId(username);
        if(user == null){
            return res.status(403).send({ Message: "User with this username not found" });
        }

        // Compare passwords
        const passwordIsValid = await PasswordManager.comparePassword(
            password,
            await Des.dencrypt(user.password)
        );

        // Check the validation of the password
        if (passwordIsValid) {

            // Generate a jwt token for the user using his data
            const user_to_enc = { userId: user.userId, role: user.role };
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

    } catch (error) {
        console.log(error);
        return res.status(401).send({ Message: "Invalid credentials" });
    }
};

module.exports = {
    indexController,
    loginController,
};
const User = require('../models/user')
const PasswordManager = require('../utils/password')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY



const indexController = async (req, res) => {

    return res.json({'Message':'home'})
}

const loginController = async (req, res) => {

    let body = req.body

    try{

        // Dummy method to get the user by user id
        let user = await User.getUser()

        // Compare submited password to user's actuall stored password
        const passwordIsValid = await PasswordManager.comparePassword(body.password, user.password)

        if (passwordIsValid){

            // Generate a jwt token for the user using his data
            jwt.sign({user}, JWT_SECRET_KEY, {expiresIn: '30m'}, (err, token)=>{
                return res.json({
                    token
                });
            })
        } else {
            return res.status(401).send({'Message':'Password incorrect'})
        }

    }
    catch(error){
        console.log(error)
        return res.status(401).send({'Message':'Invalid credentials'})
    }
}



module.exports = {
    indexController,
    loginController

}
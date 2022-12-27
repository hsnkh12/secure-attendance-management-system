const bcrypt = require('bcrypt');




class PasswordManager {

    static async hashPassword(password) {

        const salt = await bcrypt.genSalt(6);
        const hashed = await bcrypt.hash(password, salt);

        return hashed
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }


}




module.exports = {
    PasswordManager
}
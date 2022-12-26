const bcrypt = require("bcrypt");

const crypto = require("crypto");
const algorithm = "des-ecb";
// use a hex key here
const key = Buffer.from("d0e276d0144890d3", "hex");

class Des {
    static async encrypt(text) {
        const cipher = crypto.createCipheriv(algorithm, key, null);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }
    static async dencrypt(encrypted) {
        const decipher = crypto.createDecipheriv(algorithm, key, null);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}

module.exports = {
    Des,
};
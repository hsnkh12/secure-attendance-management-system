const crypto = require("crypto");
const algorithm = "des-ecb";
// use a hex key here
require("dotenv").config();
const DES_KEY = process.env.DES_KEY;

const key = Buffer.from(DES_KEY, "hex");

class Des {
    static async encrypt(text) {
        if (text != null) {
            const cipher = crypto.createCipheriv(algorithm, key, null);
            let encrypted = cipher.update(text, "utf8", "hex");
            encrypted += cipher.final("hex");
            return encrypted;
        }
        return null;
    }
    static async dencrypt(encrypted) {
        try {
            if (encrypted != null) {
                const decipher = crypto.createDecipheriv(algorithm, key, null);
                let decrypted = decipher.update(encrypted, "hex", "utf8");
                decrypted += decipher.final("utf8");
                return decrypted;
            }
            return encrypted;
        } catch {
            return encrypted;
        }
    }
}

module.exports = {
    Des,
};
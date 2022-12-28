const Department = require("./models/Department");
const Teacher = require("./models/Teacher");
const sequelize = require("./utils/db.config");
const { Des } = require("./utils/des");


// Teacher.create({
//     firstName: "Bob",
//     lastName: "Williams",
//     email: "bob.williams@gmail.com",
//     password: "123abc",
//     role: "T",
//     dateJoined: "2022-07-13",
//     userid: "10",
// });
let d;
const a = async() => {
    console.log(await Des.encrypt('CMPE'))

}
a()



// sequelize.sync();
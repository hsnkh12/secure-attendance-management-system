const express = require("express");
const {
    verifyTokenMiddleware,
    verifyUserMiddleware,
} = require("./middlewares/auth");
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const { teachers } = require("./routes/teachers");
const { indexRoutes } = require("./routes/index");
const { teachersRoutes } = require("./routes/teachers");
const { studentsRoutes } = require("./routes/students");
const { parentsRoutes } = require("./routes/parents");
const { departmentsRoutes } = require("./routes/department");
const { couresesRoutes } = require("./routes/courses");
const { attendanceRoutes } = require("./routes/attendance");
const sequelize = require("./utils/db.config");
const modelsFolder = path.join(__dirname, 'models');
fs.readdirSync(modelsFolder)
    .forEach(file => {
        if (file.endsWith('.js')) {
            const model = require(path.join(modelsFolder, file));
        }
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use("/", indexRoutes);
app.use(
    "/teachers",
    verifyTokenMiddleware,
    verifyUserMiddleware,
    teachersRoutes
);
app.use(
    "/students",
    verifyTokenMiddleware,
    verifyUserMiddleware,
    studentsRoutes
);
app.use("/parents", verifyTokenMiddleware, verifyUserMiddleware, parentsRoutes);
app.use(
    "/departments",
    verifyTokenMiddleware,
    verifyUserMiddleware,
    departmentsRoutes
);
app.use(
    "/courses",
    verifyTokenMiddleware,
    verifyUserMiddleware,
    couresesRoutes
);
app.use(
    "/attendance",
    verifyTokenMiddleware,
    verifyUserMiddleware,
    attendanceRoutes
);


var PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log(`Server now on port ${PORT}!`);
    });
});
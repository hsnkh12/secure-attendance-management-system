const express = require('express')
const {verifyTokenMiddleware, verifyUserMiddleware} = require('./middlewares/auth')
const app = express()
const bodyParser = require('body-parser')
const {indexRoutes} = require('./routes/index')
const {teachersRoutes} = require('./routes/teachers')
const {studentsRoutes} = require('./routes/students')
const {parentsRoutes} = require('./routes/parents')
const {departmentsRoutes} = require('./routes/department')
const {couresesRoutes} = require('./routes/courses')
const {attendanceRoutes} = require('./routes/attendance')
const teachers = require('./routes/teachers')


app.use(bodyParser.urlencoded({ extended: false }))

app.use('/',indexRoutes)
app.use('/teachers',verifyTokenMiddleware, verifyUserMiddleware, teachersRoutes)
app.use('/students',verifyTokenMiddleware, verifyUserMiddleware, studentsRoutes)
app.use('/parents',verifyTokenMiddleware, verifyUserMiddleware, parentsRoutes)
app.use('/departments',verifyTokenMiddleware, verifyUserMiddleware, departmentsRoutes)
app.use('/courses',verifyTokenMiddleware, verifyUserMiddleware, couresesRoutes)
app.use('/attendance',verifyTokenMiddleware, verifyUserMiddleware, attendanceRoutes)



db.sync({ force: false })
    .then(()=>{
        app.listen(3000)
    })
    .catch((error)=>{
        console.log(error)
    })

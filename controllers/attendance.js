const listAttendanceController = async(req, res) => {

    const offeredCourseCode = req.query.offered_course
    const date = req.query.date

    // Check if offered course id and date mentioned in the url 
    if (!offeredCourseCode || !date) {
        return res.status(400).send({ 'Message': 'Offered course id and date should be provided in the URL' })
    }

    try {

        // Dummy method to get the attendances related to (offered course code and date)
        const attendanceList = await null

        if (req.role = 'T') {

            // Dummy method to get offered course related to (offered course code)
            const offeredCourse = await null

            // Check if the teacher teaches this course
            if (offeredCourse.employeeId != req.userID) {
                return res.status(403).send({ 'Message': 'Only teacher associated with this course can check attendance details' })
            }

        } else if (req.role == 'C'){

            // Get course assoiated with the offered course 
            const course = await null

            // Get the teacher/chair related to (user id)
            const chair = await null

            // Check if the course is not in the same department as the chair
            if(course.depId !=chair.depId){
                return res.status(403).send({ 'Message': 'Only chair with in the same department as the course can check the attendance' })
            }

        } else if (req.role != 'A'){
            return res.status(403).send({ 'Message': 'Only admin, chairs, and teachers are allowed to check the attendance of the students' })
        }

        res.json(attendanceList)

    } catch (error) {
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}

const createAttendanceController = async(req, res) => {

    const body = req.body

    try{

        if(req.role != 'A' || req.role != 'T'){
            return res.status(403).send({'Message':'Only a teacher and admin can add new attendance'})
        }

        // Get offered course by (offered course id provided in body)
        const offeredCourse = await null

        // Check if teacher does not teach this offered course
        if(offeredCourse.employeeId != req.userID){
            return res.status(403).send({'Message':'Only teacher teaches this course can add new attendance'})
        }

        // create new attendance
        const attendance = new null
        await attendance.save()
        

    }
    catch(error){
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}

const updateAttendanceInformationController = async(req, res) => {

    try{

        // YOUR RESPONSIBLITY
        

    }
    catch(error){
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}

const deleteAttendanceController = async(req, res) => {

    try{

        // YOUR RESPONSIBLITY
        

    }
    catch(error){
        console.log(error)
        return res.status(500).send({ 'Message': 'Something went wrong' })
    }

}


module.exports = {
    listAttendanceController,
    createAttendanceController,
    updateAttendanceInformationController,
    deleteAttendanceController

}


const listAttendanceController = async (req, res) => {

    const offeredCourseID = req.query().offered_course

    // Check if offered course id mentioned in the url 
    if(!offeredCourseID){
        return res.status(404).send({'Message':'Offered course id should be included'})
    }

    try{

        // Dummy method to get offered course related to (offered course id)
        const offeredCourse = await OfferedCourse.getCourse()

        if(req.role = 'T'){

            // Check if the teacher teaches this course
            if(offeredCourse.teacherId != req.userID){
                return res.status(403).send({'Message':'Only teacher associated with this course can check it'})
            }

            // Dummy method to get the attendances related to (offered course)
            const attendanceList = await Attendance.getAttendance()
            
            res.json(attendanceList)

        } else if(req.role = 'P'){

            // Dummy method to get the attendances related to (parent's student)
            const attendanceList = await Attendance.getAttendance()

            res.json(attendanceList)

        } else {

        }

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
    
}

const createAttendanceController = async (req, res) => {

}

const updateAttendanceInformationController = async (req, res) =>{

}

const deleteAttendanceController = async (req, res) =>{

}


module.exports = {
    listAttendanceController,
    createAttendanceController,
    updateAttendanceInformationController,
    deleteAttendanceController

}
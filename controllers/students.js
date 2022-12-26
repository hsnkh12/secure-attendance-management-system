

const listStudentsController = async (req, res) => {

    const queryParams = req.query()

    try{

        if(req.role == 'T'){

            const offeredCourseID = queryParams.offered_course

            if(!offeredCourseID){
                return res.status(404).send({'Message':'Offered course id must be provided in the URL'})
            }

            // Dummy method to get offered course related to (offered course id)
            const offeredCourse = await null

            if(offeredCourse.teacherId != req.userID){
                return res.status(403).send({'Message':'Only teachers associated with this course can view its students'})
            }

            // Get all students related to (offered course id)
            const students = await null

            return res.json(students)

            

        } else if (req.role == 'C'){

            // Get teacher related to (user id)
            const teacher = await null

            // Get all students related to (teacher/chair department)
            const students = await null

            return res.json(students)

        } else if (req.role == 'A') {

            const students = await Student.getStudents()

            return res.json(students)

        } else {

            console.log(error)
            return res.status(403).send({'Message':'Only teachers, chairs, and admin can view students'})
        }

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
}

const createStudentController = async (req, res) => {

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin can add new student'})
        }

        // Create new student instance and save it 
        const student = new null
        await student.save(body)

        return res.status(201).send({'Message':'New student added'})

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})

    }

}

const getStudentDetailController = async (req, res) =>{

    const queryParams = req.query()

    try{

        if (req.role == 'C'){

            // Get teacher related to (user id)
            const teacher = await null
            
            // Get student related to (student id)
            const student = await null

            if(student.department != teacher.department){
                return res.status(403).send({'Message':'Only chair associated with this department can view the student information'})
            }

            return res.json(student)

        } else if (req.role == 'P'){

            // Get parent related to (user id)
            const parent = await null

            // Get student related to (student id)
            const student = await null

            if(parent.studentId != student.studentId){
                return res.status(403).send({'Message':"Only student's can view student information"})
            }

            return res.json(student)

        } else if(req.role == 'A'){

            // Get student related to (student id)
            const student = await null

            return res.json(student)

        } else {
            console.log(error)
            return res.status(403).send({'Message':'Only chair, parents, and admin can view student information'})

        }

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const updateStudentInformationController = async (req, res) =>{

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin can update student information'})
        }

        // update student information 
        const student = null
        await student.save(body)

        return res.json(student)

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})

    }

}

const deleteStudentController = async (req, res) =>{

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin can delete student information'})
        }

        // delete student
        const student = null
        await student.delete()

        return res.status(201).send({'Message':'Student information deleted'})

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})

    }

}


module.exports = {
    listStudentsController,
    createStudentController,
    getStudentDetailController,
    updateStudentInformationController,
    deleteStudentController

}
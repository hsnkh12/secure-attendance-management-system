

const listCoursesController = async (req, res) => {

    try{

        // Get all courses
        const courses = await null

        if(req.role == 'T'){

            // Filter all courses, and get courses that in the same department as the teacher's
            courses = courses.filter()

        } else if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin and teacher are authorized to view courses information'})
        }

        return res.json(courses)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const createCourseController = async (req, res) => {

    const body = req.body

    try{

        if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to add new course'})
        }

        // Create new course 
        const course = new null
        await course.save(body)

        return res.json(course)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const getCourseDetailController = async (req, res) =>{

    try{

        // Get course by (course id)
        const course = await null

        if(req.role == 'T'){

            // Get the teacher related to (user id)
            const teacher = await null

            // Check if teacher is not in the same department as the course
            if (course.depId != teacher.depId){
                return res.status(403).send({'Message':'Only teacher with in the same department as the course can view the course'})
            }

        } else if (req.role != 'A'){
            return res.status(403).send({'Message':'Only admin and teacher with in the same department authorized to view course details'})
        }

        return res.json(course)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const updateCourseInformationController = async (req, res) =>{

    const body = req.body

    try{

        if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to update course information'})
        }

        // Get the course 
        const course = await null
        // Update the course
        await course.save(body)

        return res.json(course)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const deleteCourseController = async (req, res) =>{

    try{

        if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to remove a course'})
        }

        // Get the course 
        const course = await null
        // Delete the course
        await course.delete()

        return res.json(course)

    }
    catch(error){
        console.log(error)
        return res.status(201).send({'Message':'Course deleted '})
    }

}

const listOfferedCoursesController = async (req, res) =>{

    try{

        // Get all offered courses
        const offeredCourses = await null

        if(req.role == 'T'){

            // Filter all offered courses, and get offered courses that teacher teaches
            offeredCourses = offeredCourses.filter()

        } else if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin and teacher are authorized to view offered courses information'})
        }

        return res.json(offeredCourses)

    }
    catch(error){
        console.log(error)
        return res.status(201).send({'Message':'Course deleted '})
    }
    

}

const createOfferedCourseController = async (req, res) => {

    const body = req.body

    try{

        if(req.role == 'A' || req.role == 'T'){

            // Create new offered course
            const course = new null
            await course.save(body)

        } else {
            return res.status(403).send({'Message':'Only Admin and teacher are authorized to offer courses'})
        }
    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const getOfferedCourseDetailController = async (req, res) =>{

    try{

        // Get offered course related to (course id)
        const offeredCourse = await null

        if(req.role == 'T'){

            // check if teacher does not teach this offered course
            if(offeredCourse.employeeId != req.userID){
                return res.status(403).send({'Message':"Only teachers who teaches this course authorized to view its information"})
            }
            

        } else if (req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin and teacher are authorized to view offered courses information'})
        }

        return res.json(offeredCourse)
        

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const updateOfferedCourseInformationController = async (req, res) =>{
// No need for this, we can delete it later
}

const deleteOfferedCourseController = async (req, res) =>{

    try{

        if(req.role == 'A' || req.role == 'T'){

            // Get the offered course
            const offeredCourse = await null

            // Check if the teacher does teach this offered course
            if(offeredCourse.employeeId != req.userID){
                return res.status(403).send({'Message':"Only teachers who teaches this offered course can delete it"})
            }

            // Delete the course
            await offeredCourse.delete()

        } else {
            return res.status(403).send({'Message':'Only Admin and teacher are authorized to offer courses'})
        }
    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

module.exports = {
    listCoursesController,
    createCourseController,
    getCourseDetailController,
    updateCourseInformationController,
    deleteCourseController,
    listOfferedCoursesController,
    createOfferedCourseController,
    getOfferedCourseDetailController,
    updateOfferedCourseInformationController,
    deleteOfferedCourseController

}
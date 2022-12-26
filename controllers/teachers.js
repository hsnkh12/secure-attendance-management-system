const { UPSERT } = require("sequelize/types/query-types")


const listTeachersController = async (req, res) => {

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to view teachers information'})
        }

        // Get all teachers 
        const teachers = await null

        return res.json(teachers)

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const createTeacherController = async (req, res) => {

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to add new teacher'})
        }

        // Create new teacher
        const teacher = new null
        await teacher.save(body)

        return res.json(teacher)

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const getTeacherDetailController = async (req, res) =>{

    try{

        // Get teacher related to ( teacher id )
        const teacher = await null

        if(req.role == 'T'){

            // Check if teacher is himself (I dont have other explanation tbh ;) )
            if(!req.userID == teacher.id){
                return res.status(403).send({'Message':"Teacher is not authorized to view other teacher's information"})
            }
            
        } else if(req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin and teacher can view teacher information'})
        }

        return res.json(teacher)


    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const updateTeacherInformationController = async (req, res) =>{

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only Admin is authorized to update teacher information'})
        }

        // Get the teacher
        const teacher = await null
        // update his information
        await teacher.save(body)

        return res.json(teacher)

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const deleteTeacherController = async (req, res) =>{

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin can delete teacher information'})
        }

        // get the teacher
        const student = await null
        // delete the teacher
        await student.delete()

        return res.status(201).send({'Message':'Teacher information deleted'})

    }
    catch(error){

        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})

    }

}


module.exports = {
    listTeachersController,
    createTeacherController,
    getTeacherDetailController,
    updateTeacherInformationController,
    deleteTeacherController

}
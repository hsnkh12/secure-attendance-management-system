

const listDepartmentsController = async (req, res) => {

    try{

        if(req.role != 'A'){
            return res.send(403).send({'Message':'Only admin is authorized to view all departments'})
        }

        // Get all departments 
        const departments = await null 

        return res.json(departments)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const createDepartmentController = async (req, res) => {

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.send(403).send({'Message':'Only admin is authorized to add a new department'})
        }

        // Create new department
        const department = new null
        await department.save(body)

        return res.json(department)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const getDepartmentDetailController = async (req, res) =>{
// No need for this
}

const updateDepartmentInformationController = async (req, res) =>{


    const body = req.body

    try{

        if(req.role != 'A'){
            return res.send(403).send({'Message':'Only admin is authorized to update department information'})
        }

        // Get the department
        const department = await null
        // update the department
        await department.save(body)

        return res.json(department)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
}

const deleteDepartmentController = async (req, res) =>{

    try{

        if(req.role != 'A'){
            return res.send(403).send({'Message':'Only admin is authorized to delete department information'})
        }

        // Get the department
        const department = await null
        // delete the department
        await department.delete()

        return res.json(department)


    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
}


module.exports = {
    listDepartmentsController,
    createDepartmentController,
    getDepartmentDetailController,
    updateDepartmentInformationController,
    deleteDepartmentController

}
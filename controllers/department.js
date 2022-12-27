const Department = require('../models/Department')
const { Des } = require("../utils/des");


const listDepartmentsController = async (req, res) => {

    try{

        const departments = await Department.findAll();
        const decryptedDepartments = await Promise.all(
            departments.map( async (department) => ({
                depId: await Des.dencrypt(department.depId),
                name: await Des.dencrypt(department.name),
            }))
        )

        return res.json(decryptedDepartments)

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

        
        const department = await Department.create({
            depId: await Des.encrypt(body.depId),
            name: await Des.encrypt(body.name)
        });

        await department.save();

        return res.json({'Message':'New department added'});

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const getDepartmentDetailController = async (req, res) =>{
    

    try{

        const depId = await Des.encrypt(req.params.departmentID)

        const department = await Department.findOne({where: {
            depId: depId
        }});

        const decryptedDepartment = {
            depId: await Des.dencrypt(department.depId),
            name: await Des.dencrypt(department.name)
        }

        return res.json(decryptedDepartment)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
    
    
}

const updateDepartmentInformationController = async (req, res) =>{


    const body = req.body

    try{

        if(req.role != 'A'){
            return res.send(403).send({'Message':'Only admin is authorized to update department information'})
        }

        const depId = await Des.encrypt(req.params.departmentID)
        
        await Department.update(body, {
            where:{
                depId: depId
            }
        })
        
        return res.json({'Message':'Department information updated'})

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

        const depId = await Des.encrypt(req.params.departmentID)

        await Department.destroy({
            where:{
                depId:depId
            }
        })

        return res.json({'Message':'Department information deleted'})


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
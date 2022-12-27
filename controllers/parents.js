

const listParentsController = async (req, res) => {

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin is authorized to view parents'})
        }

        // Get all parents
        const parents = await null

        return res.json(parents)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}

const createParentController = async (req, res) => {

    const body = req.body

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin is authorized to add new parent'})
        }

        // create new parent 
        const parent = new null
        await parent.save(body)

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }

}


const getParentDetailController = async (req, res) =>{
// No need for this, we will delete it later
}

const updateParentController = async (req, res) =>{

    const body = req.body

    try{

        if(req.role == 'A'){

            // Update the parent
            return res.json({'Message':'Updated'})

        } else if (req.role == 'P'){

            // Get the parent 
            const parent = await null

            // Check if the parent is the parent
            if (parent.userid == req.userID){
                return res.status(403).send({'Message':'ITS NOT YOU'})
            }

            // Update the parent
            return res.json({'Message':'Updated'})

        } else {
            return res.status(403).send({'Message':'Only admin and parent authorized to update a parent'})
        }

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
    
}

const deleteParentController = async (req, res) =>{

    try{

        if(req.role != 'A'){
            return res.status(403).send({'Message':'Only admin is authorized to remove a parent'})
        }

        // Get parent by id
        const parent = await null
        // delete parent
        await parent.delete()
        return res.status(201).send({'Message':'Parent information deleted'})

    }
    catch(error){
        console.log(error)
        return res.status(404).send({'Message':'Something went wrong'})
    }
}


module.exports = {
    listParentsController,
    createParentController,
    getParentDetailController,
    deleteParentController,
    updateParentController

}
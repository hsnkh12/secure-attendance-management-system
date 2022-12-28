const Parent = require('../models/Parent')



const getParentByUserId = async (userId) => {

    return await Parent.findOne({
        where: {
            userId: userId,
        },
    });

}

module.exports = {
    getParentByUserId
}
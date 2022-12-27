const express = require('express');
const router = express.Router();
const controllers = require('../controllers/parents')


router.get('/',controllers.listParentsController)
router.post('/',controllers.createParentController)

router.get('/:studentID',controllers.getParentDetailController)
router.put('/:userid',controllers.updateParentController)
router.delete('/:studentID',controllers.deleteParentController)

module.exports = {
    parentsRoutes: router
}
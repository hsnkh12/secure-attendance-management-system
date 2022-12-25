const express = require('express');
const router = express.Router();
const controllers = require('../controllers/teachers')


router.get('/',controllers.listTeachersController)
router.post('/',controllers.createTeacherController)

router.get('/:departmentID',controllers.getTeacherDetailController)
router.put('/:departmentID',controllers.updateTeacherInformationController)
router.delete('/:departmentID',controllers.deleteTeacherController)


module.exports = {
    teachersRoutes: router
}
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/students')


router.get('/',controllers.listStudentsController)
router.post('/',controllers.createStudentController)

router.get('/:studentID',controllers.getStudentDetailController)
router.put('/:studentID',controllers.updateStudentInformationController)
router.delete('/:studentID',controllers.deleteStudentController)


module.exports = {
    studentsRoutes: router
}
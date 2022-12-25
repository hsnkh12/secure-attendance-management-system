const express = require('express');
const router = express.Router();
const controllers = require('../controllers/department')


router.get('/',controllers.listDepartmentsController)
router.post('/',controllers.createDepartmentController)

router.get('/:departmentID',controllers.getDepartmentDetailController)
router.put('/:departmentID',controllers.updateDepartmentInformationController)
router.delete('/:departmentID',controllers.deleteDepartmentController)

module.exports = {
    departmentsRoutes: router
}
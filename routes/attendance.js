const express = require('express');
const router = express.Router();
const controllers = require('../controllers/attendance')



router.get('/:offeredCourseID/:',controllers.listAttendanceController)
router.post('/:offeredCourseID',controllers.createAttendanceController)
router.put('/:offeredCourseID',controllers.updateAttendanceInformationController)
router.delete('/:offeredCourseID',controllers.deleteAttendanceController)

module.exports = {
    attendanceRoutes: router
}
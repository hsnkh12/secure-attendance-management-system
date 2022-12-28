const express = require('express');
const router = express.Router();
const controllers = require('../controllers/courses')


router.get('/', controllers.listCoursesController)
router.post('/', controllers.createCourseController)

router.get('/offered', controllers.listOfferedCoursesController)
router.post('/offered', controllers.createOfferedCourseController)
router.get('/offered/:offeredCourse', controllers.getOfferedCourseDetailController)
router.put('/offered/:offeredCourse', controllers.updateOfferedCourseInformationController)
router.delete('/offered/:offeredCourse', controllers.deleteOfferedCourseController)

router.get('/:courseID', controllers.getCourseDetailController)
router.put('/:courseID', controllers.updateCourseInformationController)
router.delete('/:courseID', controllers.deleteCourseController)



module.exports = {
    couresesRoutes: router
}
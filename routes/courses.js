const express = require('express');
const router = express.Router();



router.get('/',)
router.post('/',)

router.get('/:courseID',)
router.put('/:courseID',)
router.delete('/:courseID',)

router.get('/offered')
router.post('/offered')

router.get('/offered/:offeredCourse',)
router.put('/offered/:offeredCourse',)
router.delete('/offered/:offeredCourse',)


module.exports = {
    couresesRoutes: router
}
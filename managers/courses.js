const Course = require("../models/Course");
const OfferedCourse = require("../models/OfferedCourse");


const getOfferedCourseById = async(offeredCourseID) => {
    return await OfferedCourse.findOne({
        where: {
            offeredCourseCode: offeredCourseID,
        },
    });

}
const getCourseById = async(CourseID) => {
    return await Course.findOne({
        where: {
            courseCode: CourseID,
        },
    });

}



module.exports = {
    getOfferedCourseById,
    getCourseById
}
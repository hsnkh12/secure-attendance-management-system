const OfferedCourse = require("../models/OfferedCourse");


const getOfferedCourseById = async(offeredCourseID) => {
    return await OfferedCourse.findOne({
        where: {
            offeredCourseCode: offeredCourseID,
        },
    });

}



module.exports = {
    getOfferedCourseById
}
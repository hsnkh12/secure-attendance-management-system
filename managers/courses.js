const Course = require("../models/Course");
const OfferedCourse = require("../models/OfferedCourse");
const Student = require("../models/Student");
const StudentCourse = require("../models/StudentCourse");
const { getTeacherByUserId } = require("./teachers");
const { Des } = require("../utils/des");

const getOfferedCourseById = async(offeredCourseID) => {
    return await OfferedCourse.findOne({
        where: {
            offeredCourseCode: offeredCourseID,
        },
    });
};
const getCourseById = async(CourseID) => {
    return await Course.findOne({
        where: {
            courseCode: CourseID,
        },
    });
};

const getAllCoursesByDepId = async(depId) => {
    return await Course.findAll({
        where: {
            depId: depId,
        },
    });
};

const createNewEncryptedCourse = async(body) => {
    return await Course.create({
        courseCode: await Des.encrypt(body.courseCode),
        name: await Des.encrypt(body.name),
        depId: await Des.encrypt(body.depId),
    });
};

const getDecyptedCourses = async(courses) => {
    return await Promise.all(
        courses.map(async(user) => ({
            courseCode: await Des.dencrypt(user.courseCode),
            name: await Des.dencrypt(user.name),
            depId: await Des.dencrypt(user.depId),
        }))
    );
};

const getDecyptedCourse = async(course) => {
    return {
        courseCode: await Des.dencrypt(course.courseCode),
        name: await Des.dencrypt(course.name),
        depId: await Des.dencrypt(course.depId),
    };
};

const getDecyptedOfferedCourses = async(offerdcourses) => {
    return await Promise.all(
        offerdcourses.map(async(user) => ({
            offeredCourseCode: await Des.dencrypt(user.offeredCourseCode),
            semester: await Des.dencrypt(user.semester),
            group: await Des.dencrypt(user.group),
            startDate: await Des.dencrypt(user.startDate),
            endDate: await Des.dencrypt(user.endDate),
            userId: await Des.dencrypt(user.userId),
            courseCode: await Des.dencrypt(user.courseCode),
            depId: await Des.dencrypt(teacher.depId),
        }))
    );
};

const createNewEncryptedOfferedCourse = async(body) => {
    return await OfferedCourse.create({
        offeredCourseCode: await Des.encrypt(body.offeredCourseCode),
        semester: await Des.encrypt(body.semester),
        group: await Des.encrypt(body.group),
        startDate: await Des.encrypt(body.startDate.toString()),
        endDate: await Des.encrypt(body.endDate.toString()),
        courseCode: await Des.encrypt(body.courseCode),
        userId: await Des.encrypt(body.userId),
    });
};

const getAllStudentCoursesByUserId = async(userId) => {
    return await StudentCourse.findAll({
        where: {
            userId: userId,
        },
    });
};

const getDecryptedEnrollerdCourses = async(enrolledCourses) => {
    return await Promise.all(
        enrolledCourses.map(async(course) => {
            const courseCodeGetter = await OfferedCourse.findOne({
                where: {
                    offeredCourseCode: course.offeredCourseCode,
                },
            });
            const teacher = await getTeacherByUserId(courseCodeGetter.userId);
            return {
                offeredCourseCode: await Des.dencrypt(course.offeredCourseCode),
                courseCode: await Des.dencrypt(courseCodeGetter.courseCode),
                student: await Des.dencrypt(course.userId),
                teacher: await Des.dencrypt(teacher.employeeId),
            };
        })
    );
};

const getOfferedCoursesByStdId = async(studentIad) => {
    const student = await Student.findOne({
        where: {
            studentId: studentIad,
        },
    });
    return await StudentCourse.findAll({
        where: {
            userId: student.userId,
        },
    });
};

module.exports = {
    getOfferedCourseById,
    getCourseById,
    createNewEncryptedCourse,
    getAllCoursesByDepId,
    getDecyptedCourses,
    getDecyptedCourse,
    getDecyptedOfferedCourses,
    createNewEncryptedOfferedCourse,
    getAllStudentCoursesByUserId,
    getDecryptedEnrollerdCourses,
    getOfferedCoursesByStdId,
};
const {
    getStudentByStdId,
    getStudentByUserId,
} = require("../managers/students");
const { getTeacherByUserId } = require("../managers/teachers");
const Course = require("../models/Course");
const OfferedCourse = require("../models/OfferedCourse");
const StudentCourse = require("../models/StudentCourse");
const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");
const { Op } = require("sequelize");
const {
    createNewEncryptedCourse,
    getOfferedCourseById,
    getCourseById,
    getAllCoursesByDepId,
    getDecyptedCourses,
    getDecyptedCourse,
    getDecyptedOfferedCourses,
    createNewEncryptedOfferedCourse,
    getAllStudentCoursesByUserId,
    getDecryptedEnrollerdCourses,
    getOfferedCoursesByStdId
} = require('../managers/courses')



const listCoursesController = async(req, res) => {

    try {

        // Check if role is neither Teacher nor Admin
        if (req.role != "T" && req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to view courses information",
            });
        }

        let courses = null;

        // Check if role is Teacher
        if (req.role == "T") {

            // Get teacher by user id and filter courses by teacher's department
            const teacher = await getTeacherByUserId(req.userID);
            courses = await getAllCoursesByDepId(teacher.depId);

        } else {
            // Role is admin so get all courses
            courses = await Course.findAll();
        }

        // Decrypt courses and return them
        const decryptedCourses = await getDecyptedCourses(courses)
        return res.json(decryptedCourses);

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const createCourseController = async(req, res) => {

    const body = req.body;

    try {

        // Check if the role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to add new course" });
        }

        // Create new course, encrypt, and save it
        const course = await createNewEncryptedCourse(body);
        await course.save();
        return res.status(200).send({ Message: "New course added" });

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const getCourseDetailController = async(req, res) => {

    try {

        // Decrypt courseId from URL, and get course by courseId
        const courseId = await Des.encrypt(req.params.courseID);
        const course = await getCourseById(courseId)

        if (req.role == "T") {

            const userId = req.userID;
            // Get the teacher related to (user id)
            const teacher = await Teacher.findOne({
                where: {
                    userId: userId,
                },
            });
            // Check if teacher is not in the same department as the course
            if (course.depId != teacher.depId) {
                return res.status(403).send({
                    Message: "Only teacher with in the same department as the course can view the course",
                });
            }
        } else if (req.role != "A") {
            return res.status(403).send({
                Message: "Only admin and teacher with in the same department authorized to view course details",
            });
        }

        // Decrypt the course and return it
        const decryptedCourse = await getDecyptedCourse(course)
        return res.json(decryptedCourse);

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const updateCourseInformationController = async(req, res) => {

    const body = req.body;

    try {

        // Define varuable to change, and the new value
        const value = body.value;
        const varName = body.varName;

        const courseid = await Des.encrypt(req.params.courseID);

        // Check if role is NOT Admin
        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to update course information",
            });
        }

        // Decrypt the new value
        let newValue = await Des.encrypt(value);
        let newData = {};
        newData[varName.toString()] = newValue;

        // Get and update course information
        const course = await Course.update(newData, {
            where: {
                courseCode: courseid,
            },
        });
        return res.json(course[0] == 1);

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const deleteCourseController = async(req, res) => {

    try {

        // Check if role is NOT Admin
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to remove a course" });
        }

        const courseid = await Des.encrypt(req.params.courseID);

        // Delete course information
        const course = await Course.destroy({
            where: {
                courseCode: courseid,
            },
        });
        return res.json(course == 1);

    } catch (error) {
        console.log(error);
        return res.status(201).send({ Message: "Course deleted " });
    }
};


/* 
    Offered courses controllers
*/


const listOfferedCoursesController = async(req, res) => {

    try {

        // Check if role is neither Teacher nor Admin
        // if (req.role != "T" && req.role != "A") {
        //     return res.status(403).send({
        //         Message: "Only Admin and teacher are authorized to view offered courses information",
        //     });
        // }

        // Check if role is Teacher
        if (req.role == "T") {

            // Get teacher by requested user id, and get courses related to teacher's depId
            const teacher = await getTeacherByUserId(req.userID)
            const courses = await getAllCoursesByDepId(teacher.depId)

            const courseCodes = courses.map((course) => course.courseCode);
            const offerdcourses = await OfferedCourse.findAll({
                where: {
                    courseCode: {
                        [Op.in]: courseCodes,
                    },
                },
            });

            const decryptedOfferedCourses = await getDecyptedOfferedCourses(offerdcourses)
            return res.json(decryptedOfferedCourses);

        } else {

            // Get all offered courses and decrypt them
            const offerdcourses = await OfferedCourse.findAll();
            const decryptedOfferedCourses = await Promise.all(

                offerdcourses.map(async(user) => {
                    let course = await Course.findOne({
                        attributes: ["depId"],
                        where: {
                            courseCode: user.courseCode,
                        },
                    });

                    if (course == null) {
                        course = {
                            depId: null,
                        };
                    }

                    return {
                        offeredCourseCode: await Des.dencrypt(user.offeredCourseCode),
                        semester: await Des.dencrypt(user.semester),
                        group: await Des.dencrypt(user.group),
                        startDate: await Des.dencrypt(user.startDate),
                        endDate: await Des.dencrypt(user.endDate),
                        userId: await Des.dencrypt(user.userId),
                        courseCode: await Des.dencrypt(user.courseCode),
                        depId: await Des.dencrypt(course.depId),
                    };
                })
            );
            return res.json(decryptedOfferedCourses);

        }
    } catch (error) {
        console.log(error);
        return res.status(201).send({ Message: "smth went wrong " });
    }
};



const createOfferedCourseController = async(req, res) => {

    const body = req.body;

    try {

        // Check if role is not Admin neither Teacher
        if (req.role != 'A' && req.role != 'T') {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to offer courses",
            });
        }

        // Check if role is Teacher
        if (req.role == "T") {

            const teacher = await getTeacherByUserId(req.userID)

            // Get course by course code provided in body
            const course = await getCourseById(body.courseCode)

            // Check if teacher and course does NOT belong to the same department
            if (teacher.depId != course.depId) {
                return res.status(403).send({
                    Message: "you should offer a course in your department",
                });
            }
        }

        // Create, decrypt, and save new offered course
        const offeredCourse = await createNewEncryptedOfferedCourse(body)
        await offeredCourse.save();
        return res.status(200).send({ Message: "Course added" });


    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};


/* 
    Student courses controllers
*/


const enrollCourseController = async(req, res) => {

    try {

        // Check if the role neither student nor admin
        if (req.role != "S" && req.role != "A") {

            return res.status(403).send({
                Message: "Only Admin and student authorized to enroll for a course",
            });
        }

        let studentUserId = null;

        // Check if role is Student
        if (req.role == "S") {

            const student = await getStudentByUserId(req.userID);

            // Check if user is enrolling for himself
            if (student.userId != req.userID) {
                return res.status(403).send({
                    Message: "you can only enroll for yourself",
                });
            }

            // Assign requested user as student to be enrolled
            studentUserId = req.userId;

        } else {

            // Encrypt student id and get student by the id
            const studentId = await Des.encrypt(req.body.studentId);
            const student = await getStudentByStdId(studentId);

            // Assign fetched student as student to be enrolled
            studentUserId = student.userId;
        }

        // Create new student course with assigned student user id
        const enrolledCourse = await StudentCourse.create({
            offeredCourseCode: await Des.encrypt(req.params.offeredCourse),
            userId: studentUserId,
        });
        await enrolledCourse.save();
        return res.status(200).send({ Message: "Student enrolled" });


    } catch (error) {

        if (error.name == "SequelizeUniqueConstraintError") {
            return res.status(403).send({ Message: "student is already enrolled" });
        }
        console.log(error.name);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const enrollListCourseController = async(req, res) => {
    try {

        // Check if role is either Student, Teacher, or Admin
        if (req.role == "S") {

            // Get student courses, decrypt them, and return
            const enrolledCourses = await getAllStudentCoursesByUserId(req.userID)
            const decryptedEnrollerdCourses = await getDecryptedEnrollerdCourses(enrolledCourses)
            return res.json(decryptedEnrollerdCourses);

        } else if (req.role == "T") {

            // Get all student courses and decrypt them
            const enrolledCourses = await StudentCourse.findAll();
            const decryptedEnrollerdCourses = await Promise.all(
                enrolledCourses.map(async(course) => {
                    const courseCodeGetter = await getOfferedCourseById(course.offeredCourseCode)
                    const teacher = await getTeacherByUserId(courseCodeGetter.userId);

                    // Return only courses that teacher teaches
                    if (teacher.userId == req.userID) {
                        return {
                            offeredCourseCode: await Des.dencrypt(course.offeredCourseCode),
                            courseCode: await Des.dencrypt(courseCodeGetter.courseCode),
                            group: await Des.dencrypt(courseCodeGetter.group),
                            student: await Des.dencrypt(course.userId),
                        };
                    }
                })
            );
            return res.json(decryptedEnrollerdCourses.filter((element) => element != null));

        } else if (req.role == "A") {

            // Get and decrypt all
            const enrolledCourses = await StudentCourse.findAll();
            const decryptedEnrollerdCourses = await getDecryptedEnrollerdCourses(enrolledCourses)
            return res.json(decryptedEnrollerdCourses);
        }

        return res.status(403).send({ Message: "only admin can list all enrolls" });

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const enrollListByStudent = async(req, res) => {
    try {

        const studentId = await Des.encrypt(req.params.studentId);

        // Check if role is NOT Admin
        if (req.role != 'A') {
            return res.status(403).send({ Message: "only admin can list all enrolls" });
        }

        // Get and decrypt all courses the provided student id
        const enrolledCourses = await getOfferedCoursesByStdId(studentId)
        const decryptedEnrollerdCourses = await getDecryptedEnrollerdCourses(enrolledCourses)
        return res.json(decryptedEnrollerdCourses);


    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const getOfferedCourseDetailController = async(req, res) => {
    try {

        const offerdCourseId = req.params.offeredCourse;

        if (req.role != "T" && req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to view offered course information",
            });
        }

        // Check if role is teacher
        if (req.role == "T") {

            const offeredCourse = OfferedCourse.findAll({
                where: {
                    offeredCourseCode: offerdCourseId,
                    UserId: req.userID,
                },
            });

            // check if teacher does not teach this offered course
            if (offeredCourse.userId != req.userID) {
                return res.status(403).send({
                    Message: "Only teachers who teaches this course authorized to view its information",
                });
            }
            return res.json(offeredCourse);
        }

        const offeredCourse = OfferedCourse.findAll({
            where: {
                offeredCourseCode: offerdCourseId,
            },
        });

        return res.json(offeredCourse);

    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const updateOfferedCourseInformationController = async(req, res) => {

    try {

        const value = req.body.value;
        const varName = req.body.varName;
        const offeredCourse = await Des.encrypt(req.params.offeredCourse);
        let newData = {};
        newData[varName.toString()] = await Des.encrypt(value);
        if (req.role == "T") {
            const offco = await OfferedCourse.findOne({
                where: {
                    offeredCourseCode: offeredCourse,
                },
            });
            if (offco.userId == null) {
                if (varName.toString() != "userId") {
                    newData["userId"] = req.userID;
                }
            } else if (offco.userId != req.userID) {
                return res
                    .status(403)
                    .send({ Message: "you are not allowed to do that" });
            }
        }
        const offeredCoursed = await OfferedCourse.update(newData, {
            where: {
                offeredCourseCode: offeredCourse,
            },
        });
        return res.json(offeredCoursed[0] === 1);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};



const deleteOfferedCourseController = async(req, res) => {
    try {
        const offeredCourse = await Des.encrypt(req.params.offeredCourse);

        if (req.role == "A" || req.role == "T") {

            // Get the offered course
            const offeredCourseData = await OfferedCourse.findOne({
                where: {
                    offeredCourseCode: offeredCourse,
                },
            });

            // Check if the teacher does teach this offered course
            if (offeredCourseData.userId != req.userID && req.role == "T") {
                return res.status(403).send({
                    Message: "Only teachers who teaches this offered course can delete it",
                });
            }

            // Delete the course
            await OfferedCourse.destroy({
                where: {
                    offeredCourseCode: offeredCourse,
                },
            });
            return res.status(200).send({
                Message: "deleted",
            });
        } else {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to offer courses",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

module.exports = {
    listCoursesController,
    createCourseController,
    getCourseDetailController,
    updateCourseInformationController,
    deleteCourseController,
    listOfferedCoursesController,
    createOfferedCourseController,
    getOfferedCourseDetailController,
    updateOfferedCourseInformationController,
    deleteOfferedCourseController,
    enrollCourseController,
    enrollListCourseController,
    enrollListByStudent,
};
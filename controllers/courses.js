const Course = require("../models/Course");
const OfferedCourse = require("../models/OfferedCourse");
const Teacher = require("../models/Teacher");
const { Des } = require("../utils/des");
const { Sequelize, Model, Op } = require("sequelize");

const listCoursesController = async(req, res) => {
    try {
        if (req.role != "T" && req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to view courses information",
            });
        }

        // Get all courses

        if (req.role == "T") {
            // Filter all courses, and get courses that in the same department as the teacher's
            courses = courses.filter();
        }
        const courses = await Course.findAll();
        const transformedCourses = await Promise.all(
            courses.map(async(user) => ({
                courseCode: await Des.dencrypt(user.courseCode),
                name: await Des.dencrypt(user.name),
                depId: await Des.dencrypt(user.depId),
            }))
        );
        return res.json(transformedCourses);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const createCourseController = async(req, res) => {
    const body = req.body;

    try {
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to add new course" });
        }
        const body = req.body;

        // Create new course
        const course = await Course.create({
            courseCode: await Des.encrypt(body.courseCode),
            name: await Des.encrypt(body.name),
            depId: await Des.encrypt(body.depId),
        });
        await course.save();

        return res.status(200).send({ Message: "Course added" });
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const getCourseDetailController = async(req, res) => {
    try {
        const courseid = req.params.courseID;
        // Get course by (course id)
        const course = await Course.findOne({
            where: {
                courseCode: courseid,
            },
        });
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
        const transformedUser = {
            courseCode: await Des.dencrypt(course.courseCode),
            name: await Des.dencrypt(course.name),
            depId: await Des.dencrypt(course.depId),
        };

        return res.json(transformedUser);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }
};

const updateCourseInformationController = async(req, res) => {
    const body = req.body;

    try {
        const value = req.body.value;
        const varName = req.body.varName;
        const courseid = await Des.encrypt(req.params.courseID);

        if (req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin is authorized to update course information",
            });
        }
        let newValue = await Des.encrypt(value);
        let newData = {};
        newData[varName.toString()] = newValue;

        // Get the course
        console.log();
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
        if (req.role != "A") {
            return res
                .status(403)
                .send({ Message: "Only Admin is authorized to remove a course" });
        }
        const courseid = await Des.encrypt(req.params.courseID);

        // Get the course
        const course = await Course.destroy({
            where: {
                courseCode: courseid,
            },
        });
        // Delete the course

        return res.json(course == 1);
    } catch (error) {
        console.log(error);
        return res.status(201).send({ Message: "Course deleted " });
    }
};

const listOfferedCoursesController = async(req, res) => {
    try {
        if (req.role != "T" && req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to view offered courses information",
            });
        }

        // Get all offered coursesl

        if (req.role == "T") {
            // Filter all offered courses, and get offered courses that teacher teaches
            const teacher = await Teacher.findOne({
                where: {
                    userId: req.userID,
                },
            });
            const courses = await Course.findAll({
                where: {
                    depId: teacher.depId,
                },
            });

            const courseCodes = courses.map((course) => course.courseCode);
            const offerdcourses = await OfferedCourse.findAll({
                where: {
                    courseCode: {
                        [Op.in]: courseCodes,
                    },
                },
            });

            const transformedCourses = await Promise.all(
                offerdcourses.map(async(user) => ({
                    offeredCourseCode: await Des.dencrypt(user.offeredCourseCode),
                    semester: await Des.dencrypt(user.semester),
                    group: await Des.dencrypt(user.group),
                    startDate: await Des.dencrypt(user.startDate),
                    endDate: await Des.dencrypt(user.endDate),
                    userId: await Des.dencrypt(user.UserId),
                    courseCode: await Des.dencrypt(user.courseCode),
                    depId: await Des.dencrypt(teacher.depId),
                }))
            );
            return res.json(transformedCourses);
        } else {
            const offerdcourses = await OfferedCourse.findAll();

            const transformedCourses = await Promise.all(
                // don't touch this i don't know how i did this :)
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

            return res.json(transformedCourses);
        }
    } catch (error) {
        console.log(error);
        return res.status(201).send({ Message: "smth went wrong " });
    }
};

const createOfferedCourseController = async(req, res) => {
    const body = req.body;
    try {
        if (req.role == "A" || req.role == "T") {
            // Create new offered course
            if (req.role == "T") {
                const teacher = await Teacher.findOne({
                    where: {
                        userId: req.userID,
                    },
                });
                const course = await Course.findOne({
                    where: {
                        courseCode: body.courseCode,
                    },
                });
                if (teacher.depId != course.depId) {
                    return res.status(403).send({
                        Message: "you should offer a course in your department",
                    });
                }
            }

            const offeredCourse = await OfferedCourse.create({
                offeredCourseCode: await Des.encrypt(body.offeredCourseCode),
                semester: await Des.encrypt(body.semester),
                group: await Des.encrypt(body.group),
                startDate: await Des.encrypt(body.startDate.toString()),
                endDate: await Des.encrypt(body.endDate.toString()),
                courseCode: await Des.encrypt(body.courseCode),
                userId: await Des.encrypt(body.userId),
            });
            await offeredCourse.save();
            return res.status(200).send({ Message: "Course added" });
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

const getOfferedCourseDetailController = async(req, res) => {
    try {
        const offerdCourseId = req.params.offeredCourse;
        if (req.role != "T" && req.role != "A") {
            return res.status(403).send({
                Message: "Only Admin and teacher are authorized to view offered course information",
            });
        }

        // Get offered course related to (course id)

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

        if (req.role == "A") {
            const offeredCoursed = await OfferedCourse.update(newData, {
                where: {
                    offeredCourseCode: offeredCourse,
                },
            });
            return res.json(offeredCoursed[0] === 1);
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ Message: "Something went wrong" });
    }

};

const deleteOfferedCourseController = async(req, res) => {
    try {
        if (req.role == "A" && req.role == "T") {
            // Get the offered course
            const offeredCourse = await null;

            // Check if the teacher does teach this offered course
            if (offeredCourse.UserId != req.userID) {
                return res.status(403).send({
                    Message: "Only teachers who teaches this offered course can delete it",
                });
            }

            // Delete the course
            await offeredCourse.delete();
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
};
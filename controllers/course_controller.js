var course = require('../models/course_db')
var response = require('../utils/response')
var UserValidator = require('../validators/user_validator');
var CourseLogger = require('../logger').CourseLogger


const getAllCourses = async (req, res) => {
    course.getAllCourses()
        .then(r => {
            response(res, r);
        })
        .catch(err => {
            CourseLogger.error(`get all courses error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const getCourses = async (req, res) => {
    let id = req.session.loginUser;
    let p = null
    if (await UserValidator.getUserTypeById(id) == "student") { // 学生
        p = course.getCoursesByStudent(id);
    } else { // 老师
        p = course.getCoursesByTeacher(id);
    }

    p.then(data => {
        response(res, data);
    })
        .catch(err => {
            CourseLogger.error(`get courses error => ${err.stack}`);
            response(res, 500, 'Server error.');
        });
}

const createCourse = async (req, res) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) != 'teacher') {
        response(res, 401, 'Permission denied.');
        return
    }

    data = req.body;
    console.log(data);
    course.createCourse(data)
        .then(r => {
            if (r) {
                response(res, {});
            } else {
                // 有点问题，但是不知道怎么打log
                response(res, 500, "Unknown error.");
            }
        })
        .catch(err => {
            CourseLogger.error(`create course error => ${err.stack}`);
            response(res, 500, 'Server error.');
        });
}

const removeCourse = async (req, res) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) != 'teacher') {
        response(res, 401, 'Permission denied.');
        return
    }

    id = req.params.id

    course.removeCourse(id)
        .then(r => {
            if (r) {
                response(res, {});
            } else {
                response(res, 404, 'Not found.');// 其实不清楚是不是not found
            }
        })
        .catch(err => {
            CourseLogger.error(`delete course error => ${err.stack}`);
            response(res, 500, 'Server error.');
        });
}

const getStudentsByCourseID = async (req, res) => {
    cid = req.params.id
    course.getStudentsByCourseID(cid)
        .then(r => {
            if (r)
                response(res, r);
            else
                response(res, 404, 'Not found.')
        })
        .catch(err => {
            CourseLogger.error(`get students by course_id error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const getTeacherByCourseID = async (req, res) => {
    cid = req.params.id
    course.getTeachersByCourseID(cid)
        .then(r => {
            if (r)
                response(res, r);
            else
                response(res, 404, 'Not found.')
        })
        .catch(err => {
            CourseLogger.error(`get students by course_id error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const addStudentsByCourseID = async (req, res) => {
    // 其实为啥不扩展成一次能添加多个的

    if (await UserValidator.getUserTypeById(req.session.loginUser) != 'teacher') {
        response(res, 401, 'Permission denied.');
        return
    }

    cid = req.params.id;
    sid = req.body.id;
    if (!sid) {
        response(res, 400, 'Bad request.');
        return;
    }

    course.addStudentToCourse(cid, sid)
        .then(r => {
            if (r)
                response(res, {});
            else
                response(res, 404, 'Not found.');
        })
        .catch(err => {
            CourseLogger.error(`add student by course_id error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const addTeacherByCOurseID = async (req, res) => {

    if (await UserValidator.getUserTypeById(req.session.loginUser) != 'teacher') {
        response(res, 401, 'Permission denied.');
        return
    }

    cid = req.params.id;
    tid = req.body.id;
    if (!tid) {
        response(res, 400, 'Bad request.');
        return;
    }

    course.addTeacherToCourse(cid, tid)
        .then(r => {
            if (r)
                response(res, {});
            else
                response(res, 404, 'Not found.');
        })
        .catch(err => {
            CourseLogger.error(`add teacher by course_id error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const getCoursesManagePage = async (req, res) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) != 'teacher') {
        response(res, 401, 'Permission denied.');
        return
    }

    res.render('course-manage');
}

module.exports = {
    getCoursesManagePage,
    getAllCourses,
    getCourses,
    createCourse,
    removeCourse,
    getStudentsByCourseID,
    getTeacherByCourseID,
    addStudentsByCourseID,
    addTeacherByCOurseID
}
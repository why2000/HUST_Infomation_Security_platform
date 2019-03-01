var course = require('../models/course_db')
var SemesterSet = require('../config/semester.json')
var response = require('../utils/response')
var UserValidator = require('../validators/user_validator');
var CourseLogger = require('../logger').CourseLogger
var fs = require('fs')
var path = require('path');

const getAllSemester = async (req, res) => {
    if (req.session.loginUser) {
        response(res, SemesterSet.ALL_SEMESTER);
    }
}

const getNowSemester = async (req, res) => {
    if (req.session.loginUser) {
        if (req.session.semester) {
            response(res, req.session.semester);
        }
        else {
            response(res, SemesterSet.NOW_SEMESTER);
        }
    }
}

const createNewSemester = async (req, res) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) != "teacher") {
        response(res, 401, 'Permission denied.');
    } else {
        console.log(__dirname);
        let nowSemester = SemesterSet.NOW_SEMESTER;
        let firstyear = parseInt(nowSemester.substring(0, 2));
        let lastyear = parseInt(nowSemester.substring(2, 4));
        let seme = nowSemester.substring(4, 5) == "a" ? "b" : "a"

        if(nowSemester.substring(4, 5) == "a"){
            seme="b";
        }else{
            firstyear++;
            lastyear++;
        }

        SemesterSet.NOW_SEMESTER = `${firstyear}${lastyear}${seme}`
        SemesterSet.ALL_SEMESTER.push(SemesterSet.NOW_SEMESTER);
        fs.writeFileSync(path.join(__dirname,'../config/semester.json'), JSON.stringify({
            "NOW_SEMESTER": SemesterSet.NOW_SEMESTER,
            "ALL_SEMESTER": SemesterSet.ALL_SEMESTER
        }));

        req.session.semester=undefined;

        response(res, SemesterSet.NOW_SEMESTER);
    }
}

const changeSemesterTmp = async (req, res) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) != "teacher") {
        response(res, 401, 'Permission denied.');
    } else {
        console.log(SemesterSet.ALL_SEMESTER.includes(req.body.newSemester))
        if (SemesterSet.ALL_SEMESTER.includes(req.body.newSemester)) {
            req.session.semester = req.body.newSemester;
            response(res, 200, 'Done');
        } else {
            response(res, 500, 'Server error');
        }
    }
}

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
        if (req.session.semester) {
            p = course.getCoursesByTeacher(id, req.session.semester);
        }
        else {
            p = course.getCoursesByTeacher(id);
        }
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

const deleteStudentsByCourseID = async (req, res) => {
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

    course.deleteStudentToCourse(cid, sid)
        .then(r => {
            if (r)
                response(res, {});
            else
                response(res, 404, 'Not found.');
        })
        .catch(err => {
            CourseLogger.error(`delete student by course_id error => ${err.stack}`);
            response(res, 500, 'Server error.');
        })
}

const deleteTeacherByCOurseID = async (req, res) => {

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

    course.deleteTeacherToCourse(cid, tid)
        .then(r => {
            if (r)
                response(res, {});
            else
                response(res, 404, 'Not found.');
        })
        .catch(err => {
            CourseLogger.error(`delete teacher by course_id error => ${err.stack}`);
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
    getAllSemester,
    getNowSemester,
    createNewSemester,
    changeSemesterTmp,
    getAllCourses,
    getCourses,
    createCourse,
    removeCourse,
    getStudentsByCourseID,
    getTeacherByCourseID,
    addStudentsByCourseID,
    addTeacherByCOurseID,
    deleteStudentsByCourseID,
    deleteTeacherByCOurseID
}
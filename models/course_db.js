/* 
    关于课程方面的处理的Model层
    按照老师最新(2018/9/23)的要求中，课程作为基本的单元。(近乎)所有的操作需要围绕着课程来进行
*/

let ConfigSet = require('../config/course.json');
let ErrorSet = require('../utils/error_util');
let CourseLogger = require('../logger').CourseLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;

let db;// = new MongoDB.Db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        CourseLogger.error(`database error => ${err.stack}`);
        throw err;
    }

    db = client.db(ConfigSet.DATABASE_NAME);
});

/**
 * 组装课程数据
 * @param {object} data 数据
 */
const assembleCourseData = async (data) => {
    ret = {}
    ret.name = data.name ? data.name : ""
    ret.description = data.description ? data.description : ""
    ret.teacher = data.teacher ? data.teacher : []
    ret.student = data.student ? data.student : []
    return ret
}

/**
 * 获取全部课程
 */
const getAllCourses = async () => {
    return db.collection('course').find()
        .project({ student: 0 })
        .toArray()
}

/**
 * 获得课程信息
 * @param {string} id 
 */
const getCourseInfo = async (id) => {
    let colCourse = db.collection('course')
    id = MongoDB.ObjectID(id)
    return colCourse.findOne({ _id: id })
        .then(r => {
            return {
                name: r.name,
                description: r.description,
                teacher: r.teacher
            }
        })
}

/**
 * 创建课程
 * @param {string} name 课程名称 
 */
const createCourse = async (data) => {
    data = await assembleCourseData(data);
    console.log(data);
    let colCourse = db.collection('course')
    return colCourse.insertOne(data).then(res => res.result.ok == 1);
}

/**
 * 删除一门课程
 * @param {string} id 
 */
const removeCourse = async (id) => {
    let colCourse = db.collection('course');
    id = MongoDB.ObjectID(id);
    console.log(id);
    return colCourse.deleteOne({
        _id: id
    }).then(res => res.result.ok == 1);
}

/**
 * 添加学生到课程中
 * @param {string} course_id 课程ID
 * @param {string} student_id 学生ID
 */
const addStudentToCourse = async (course_id, student_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.updateOne({ _id: course_id }, { $addToSet: { "student": student_id } }).then(r => r.result.ok == 1);
}



/**
 * 添加教师到课程中
 * @param {string} course_id 课程ID
 * @param {string} teacher_id 教师ID
 */
const addTeacherToCourse = async (course_id, teacher_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.updateOne({ _id: course_id }, { $addToSet: { student: teacher_id } }).then(r => r.result.ok == 1);
}

/**
 * 从课程中删除学生
 * @param {string} course_id 课程ID
 * @param {string} student_id 学生ID
 */
const deleteStudentToCourse = async (course_id, student_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.updateOne({ _id: course_id }, { $pull: { "student": student_id } }).then(r => r.result.ok == 1);
}

/**
 * 从课程中删除教师
 * @param {string} course_id 课程ID
 * @param {string} teacher_id 教师ID
 */
const deleteTeacherToCourse = async (course_id, teacher_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.updateOne({ _id: course_id }, { $pull: { teacher: teacher_id } }).then(r => r.result.ok == 1);
}

/**
 * 获取学生所拥有的所有课程
 * @param {string} id 学生ID
 */
const getCoursesByStudent = async (id) => {
    let colCourse = db.collection('course');
    return colCourse.find({ student: id })
        .project({ teacher: 0, student: 0 })
        .toArray();
}

/**
 * 获取教师所拥有的全部课程
 * @param {string} id 教师ID
 */
const getCoursesByTeacher = async (id) => {
    let colCourse = db.collection('course');
    return colCourse.find({ teacher: id })
        .project({ teacher: 0, student: 0 })
        .toArray();
}

/**
 * 判断学生是否在这个课程中
 * @param {string} course_id 课程ID
 * @param {string} student_id 学生ID
 */
const studentInCourse = async (course_id, student_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.findOne({ _id: course_id, student: student_id }).then(r => r ? true : false);
}

/**
 * 判断教师是否在这个课程中
 * @param {string} course_id 课程ID 
 * @param {string} teacher_id 教师ID
 */
const teacherInCourse = async (course_id, teacher_id) => {
    let colCourse = db.collection('course');
    course_id = MongoDB.ObjectID(course_id);
    return colCourse.findOne({ _id: course_id, teacher: teacher_id }).then(r => r ? true : false);
}

/**
 * 获取某一课程的所有学生
 * @param {string} id 课程ID
 * @returns {Promise<string[]>} 学生ID列表 
 */
const getStudentsByCourseID = async (id) => {
    let colCourse = db.collection('course');
    id = MongoDB.ObjectID(id)
    return colCourse.findOne({ _id: id }).then(r => r ? r.student : null)
}

/**
 * 获取某一课程的所有教师
 * @param {string} id 课程ID
 * @returns {Promise<string[]>} 教师ID列表 
 */
const getTeachersByCourseID = async (id) => {
    let colCourse = db.collection('course');
    id = MongoDB.ObjectID(id)
    return colCourse.findOne({ _id: id }).then(r => r ? r.teacher : null)
}


module.exports = {
    getCourseInfo,
    createCourse,
    removeCourse,
    addStudentToCourse,
    addTeacherToCourse,
    deleteStudentToCourse,
    deleteTeacherToCourse,
    getCoursesByStudent,
    getCoursesByTeacher,
    studentInCourse,
    teacherInCourse,
    getAllCourses,
    getStudentsByCourseID,
    getTeachersByCourseID
}
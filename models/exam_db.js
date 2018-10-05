'use strict';

let ConfigSet = require('../config/exam.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let ExamLogger = require('../logger').ExamLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

let db;

MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function (err, res) {
            if (err) {
                ExamLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
    }
});

/**
 * 通过课程ID获得测试
 * @param {string} course_id 课程ID 
 */
const getExamsByCourseID = async (course_id) => {
    let colExam = db.collection('exam');
    let cid = MongoDB.ObjectId(course_id);

    return colExam.find({
        course_id: cid
    })
    .project({
        course_id: 0,
        content: 0,
        timelimit: 0
    })
    .toArray();
}

/**
 * 上传练习
 * @param {{course_id: string, title: string, content: any[], timelimit: number}} data 数据
 */
const saveExam = async (data) => {
    let colExam = db.collection('exam');
    data.course_id = MongoDB.ObjectId(data.course_id);

    return colExam.insertOne(data)
           .then(r => r.result.ok == 1);
}

const getExamInfo = async (course_id, exam_id) => {
    let colExam = db.collection('exam');
    let cid = MongoDB.ObjectId(course_id),
        eid = MongoDB.ObjectId(exam_id);

    return colExam.findOne({
        _id: eid,
        course_id: cid
    });
}
 
const getTimeLimit = async (course_id, exam_id) => {
    let inf = await getExamInfo(course_id, exam_id);
    return inf ? inf.timelimit : null;
}

const getStudentScoreUndone = async (student_id, exam_id) => {
    let colScore = db.collection('score');

    let eid = MongoDB.ObjectId(exam_id);
    return colScore.findOne({
        exam_id: eid,
        student_id: student_id,
        has_done: false
    });
}

const createStudentScore = async (exam_id, student_id, start_time)  => {
    let colScore = db.collection('score');
    let eid = MongoDb.ObjectId(exam_id);

    return colScore.insertOne({
        exam_id: eid,
        student_id: student_id,
        start_time: start_time,
        has_done: false
    })
    .then(r => r.result.ok == 1);
}

const setStudentScoreDone = async (exam_id, student_id, score) => {
    let colScore = db.collection('score');
    let eid = MongoDb.ObjectId(exam_id);

    return colScore.updateOne({
        exam_id: eid,
        student_id: student_id
    }, {
        $set: {
            has_done: true,
            score: score
        }
    })
    .then(r => r.result.ok == 1);
} 

module.exports = {
    getExamsByCourseID,
    saveExam,
    getExamInfo,
    getTimeLimit,
    getStudentScoreUndone,
    setStudentScoreDone,
    createStudentScore
}
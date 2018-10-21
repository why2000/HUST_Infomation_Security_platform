'use strict'

let ConfigSet = require('../config/feedback.json');
let ErrorSet = require('../utils/error_util');
let FeedbackLogger = require('../logger').FeedbackLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        FeedbackLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function (err, res) {
            if (err) {
                FeedbackLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
        db.createCollection('report', function (err, res) {
            if (err) {
                FeedbackLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
        db.createCollection('judgement', function (err, res) {
            if (err) {
                FeedbackLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
    }
});

/**
 * 通过学生ID和模块ID获得报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const getReportByStudentIDAndModuleID = async (student_id, module_id) => {
    let colReport = db.collection('report');
    let ret = null;
    let res = await colReport.findOne({
        student_id: student_id,
        module_id: module_id
    })


    return res ? res.report : null;
}

/**
 * 通过学生ID获得所有报告
 * @param {string} student_id 学生ID
 */
const getReportsByStudentID = async (student_id) => {
    let colReport = db.collection('report');
    return colReport.find({
        student_id: student_id
    }).project({
        _id: 0
    }).toArray();
}

/** 
 * 通过模块ID获得所有报告
 * @param {string} module_id 模块ID
 */
const getReportsByModuleID = async (module_id) => {
    let colReport = db.collection('report');
    return colReport.find({
        module_id: module_id
    })
    .project({
        _id: 0
    })
    .toArray();
}

/**
 * 插入报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} file_id 文件ID
 */
const insertReport = async (student_id, module_id, file_id, file_name) => {
    let colReport = db.collection('report');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        file_id: file_id
    };

    return colReport.insertOne(doc).then(res => res.result.ok == 1);
}

/**
 *  更新或插入报告
 *  建议用这个直接代替插入报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} file_id 文件ID
 */
const upsertReport = async (student_id, module_id, file_id, file_name) => {
    let colReport = db.collection('report');
    return colReport.updateOne({
        student_id: student_id,
        module_id: module_id
    }, {
            $addToSet: {
                report: {
                    file_name: file_name,
                    file_id: file_id
                }
            }
        }, {
            upsert: true
        }).then(res => res.result.ok == 1)
}

/**
 * 移除报告
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const removeReport = async (student_id, module_id, file_id) => {
    let colReport = db.collection('report');
    console.log(file_id)
    return colReport.updateOne({
        module_id: module_id,
        student_id: student_id
    }, {
        $pull: {
            report: {
                file_id: file_id
            }
        }
    }).then(res => res.result.ok == 1);
}

/**
 * 获得学生和模块ID符合的所有记录
 * @param {string} student_id 
 * @param {string} module_id 
 */
const getAllJudgementByStudentIDAndModuleID = async (student_id, module_id) => {
    var colJudgement = db.collection('judgement');
    return colJudgement.find({
        student_id: student_id,
        module_id, module_id
    })
    .project({
        _id: 0,
        student_id: 0,
        module_id: 0
    })
    .toArray()
}

/**
 * 通过学生ID和模块ID获得教师评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */

const getJudgementByStudentIDAndModuleID = async (student_id, module_id, file_id) => {
    var colJudgement = db.collection('judgement');
    try {
        var result = await colJudgement.findOne({
            student_id: student_id,
            module_id: module_id,
            file_id: file_id
        });
    } catch (err) {
        FeedbackLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    return result;
}

/**
 * 通过学生ID获得所有评价
 * @param {string} student_id 学生ID
 */
const getJudgementsByStudentID = async (student_id) => {
    let colJudgement = db.collection('judgement');
    return colJudgement.find({
        student_id: student_id
    }).project({
        _id: 0
    }).toArray();
}

/**
 * 通过模块ID获得所有评价
 * @param {string} module_id 模块ID
 */
const getJudgementsByModuleID = async (module_id) => {
    let colJudgement = db.collection('judgement');
    return colJudgement.find({
        module_id: module_id
    }).project({
        _id: 0
    }).toArray();
}

/**
 * 插入评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {number} score 成绩
 * @param {string} text 评价文字
 */
const insertJudgement = async (student_id, module_id, score, text) => {
    let colJudgement = db.collection('judgement');
    let doc = {
        student_id: student_id,
        module_id: module_id,
        score: score,
        text: text
    };

    return colJudgement.insertOne(doc).then(res => res.result.ok == 1);
}

/**
 * 更新或插入评价
 * 建议用这个直接代替插入评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 * @param {string} score 成绩
 * @param {string} text 评价文字
 */
const upsertJudgement = async (student_id, module_id, file_id, file_name, score, text) => {
    let colReport = db.collection('judgement');
    return colReport.updateOne({
        student_id: student_id,
        module_id: module_id,
        file_id: file_id
        }, {
            $set: {
                score: score,
                text: text
            }
        }, {
            upsert: true
        }).then(res => res.result.ok == 1);
}

/**
 * 移除评价
 * @param {string} student_id 学生ID
 * @param {string} module_id 模块ID
 */
const removeJudgement = async (student_id, module_id, file_id) => {
    let colJudgement = db.collection('judgement');
    return colJudgement.deleteOne({
        student_id: student_id,
        module_id: module_id,
        file_id: file_id
    }).then(res => res.result.ok == 1);
}


module.exports = {
    getAllJudgementByStudentIDAndModuleID,
    getJudgementsByModuleID,
    getJudgementByStudentIDAndModuleID,
    getJudgementsByStudentID,
    getReportByStudentIDAndModuleID,
    getReportsByModuleID,
    getReportsByStudentID,
    insertReport,
    insertJudgement,
    removeReport,
    removeJudgement,
    upsertReport,
    upsertJudgement
}
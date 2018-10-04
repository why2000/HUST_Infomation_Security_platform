'use strict';

var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');
let response = require('../utils/response');
let Exam = require('../models/exam_db');
let project = require('../utils/project');
let time = require('../utils/time');


exports.getIndexPage = async (req, res) => {
    var page = "exam";

    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
        page += "_teacher"
    }

    res.render(page);
}

exports.getExams = async (req, res) => {
    let cid = req.params.course_id;

    Exam.getExamsByCourseID(cid)
    .then(r => {
        response(res, r);
    })
    .catch(err => {
        UserLogger.error(`getExams error => ${err.stack}`);
        response(res, 500, 'Server error.');
    });
}

exports.saveExam = async (req, res) => {
    let cid = req.params.course_id,
        title = req.body.title,
        content = req.body.content,
        timelimit = req.body.timelimit;

    // 其实没有做严格的参数检测
    if(!title || !content || !timelimit) {
        response(res, 400, 'Bad request.');
        return;
    }

    Exam.saveExam({
        course_id: cid,
        title: title,
        content: content,
        timelimit: timelimit
    })
    .then(r => {
        if(r) {
            response(res, {});
        } else {
            response(res, 500, 'Unknown error.');
        }
    })
    .catch(err => {
        UserLogger.error(`saveExam error => ${err.stack}`);
        response(res, 500, 'Server error.');
    });
}

exports.getExamInfo = async (req, res) => {
    let p = ['title', 'description', 'timelimit'];
    if(UserValidator.getUserTypeById(req.session.loginUser) == 'teacher') {
        p.push('content');
    }

    Exam.getExamInfo(req.session.course_id, req.session.exam_id)
    .then(r => {
        if(r) {
            response(res, project(r, p));
        } else {
            response(res, 404, 'Not found.');
        }
    })
    .catch(err => {
        UserLogger.error(`getExamInfo error => ${err.stack}`);
        response(res, 500, 'Server error.');
    });
}

exports.startExam = async (req, res) => {
        /*
        这一块儿逻辑比较复杂，有点难受
        大体整理一下思路
        - 获得测试时限
        - 检查学生是否之前已经开始过测试(未完成的)
            - 如果没有就插入条目并开始
        - 如果有
            - 检查是否超过时限，超过返回TLE
            - 没有超过，计算得出剩余时间返回
    */

    let eid = req.params.exam_id,
        cid = req.params.course_id,
        sid = req.session.loginUser;

    if(UserValidator.getUserTypeById(sid) != 'student') {
        response(res, 401, 'Permission denied.');
        return;
    }

    let inf = await Exam.getExamInfo(cid, eid, {projection: {'content.answer' : 0}});
    if(!inf) {
        response(res, 404, 'Exam not found.');
        return;
    }

    let studentScore = Exam.getStudentScoreUndone(uid, eid);
    if(!studentScore) { // 如果没有未完成的测试
        Exam.createStudentScore(eid, sid, time())
            .then(r => {
                if(r) {
                    response(res, {timelimit: inf.timelimit, content: inf.content});
                } else {
                    response(res, 500, 'Unknown error.');
                }
            })
    } else { // 有未完成的测试
        let t = studentScore.startTime + inf.timelimit - time();
        if(t > 0) { // 未超时
            response(res, {timelimit: t, content: inf.content});
        } else {
            Exam.setStudentScoreDone(eid, sid, "超时") // 超时自动交卷，但是没有成绩
                .then(r => {
                    if(r) {
                        response(res, 400, 'Time Limit Exceeded.');
                    } else {
                        response(res, 500, 'Unknown error.');
                    }
                })
                .catch(err => {
                    UserLogger.error(`startExam error => ${err.stack}`);
                    response(res, 500, 'Server error.');
                })
        }

    }
}

exports.stopExam = async (req, res) => {
    let user = req.body;
    if(!user || !Array.isArray(user)) {
        response(res, 400, 'Bad request.');
        return;
    }

    let cid = req.params.course_id,
        eid = req.params.exam_id,
        sid = req.params.loginUser;

    if(UserValidator.getUserTypeById(sid) != 'student') {
        response(res, 401, 'Permission denied.');
        return;
    }
    
    let inf = Exam.getExamInfo(cid, eid);
    if(!inf) {
        response(res, 404, 'Exam not found.');
        return;
    }

    calcScore(inf, user)
    .then(score => {
        Exam.setStudentScoreDone(eid, sid, score)
        .then(r => {
            if(r) {
                response(res, {score: score});
            } else {
                response(res, 500, 'Unknown error.');
            }
        })
    })
    .catch(err => {
        UserLogger.error(`stopExam error => ${err.stack}`);
        response(res, 500, 'Server error.');
    })


}

exports.getScores = async (req, res) => {

}

const calcScore = async (exam, user) => {
    exam = exam.content;
    
}
'use strict'
var feedback = require('../models/feedback_db');
var file = require('../models/file_db');
var user = require('../models/user_db');
var response = require('../utils/response');
var extname = require('path').extname;
var cfg = require('../config/feedback.json');
var fs = require('fs');
var UserValidator = require('../validators/user_validator');
let FeedbackLogger = require('../logger').FeedbackLogger;

/* 
    考虑添加一个全局的ErrorHandler(如果有这种玩意儿)
*/

const getStudentList = async (req, res) => {
    if (req.session.loginUser && (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher")) {
        var teacherID = req.session.loginUser;
        user.getStudentListByTeaID(teacherID)
            .catch(err => {
                res.status(500).send("Server error");
                throw (err);
            })
            .then(result => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(500).send("No data");
                }
            })
    } else {
        res.status(401).send("permission denied");
    }
}

const getPageByUserType = async (req, res) => {

    if (!req.session.loginUser) {
        res.redirect('/');
    } else {
        UserValidator.getUserTypeById(req.session.loginUser).then(user_type => {
            if (user_type == "student") {
                if (req.params.class_id != 'index') {
                    res.render('report-upload');
                } else {
                    res.render('report-index');
                }
            } else if (user_type == "teacher") {
                res.render("judge-upload");
            }
        });
    }
}

const getStudentReport = async (req, res) => {
    if (req.session.loginUser &&
        ((await UserValidator.getUserTypeById(req.session.loginUser) == "teacher")) ||
        (req.session.loginUser == req.params.student_id)) {
        feedback.getReportByStudentIDAndModuleID(req.params.student_id, req.params.class_id)
            .catch(err => {
                //need a logger
                response(res, 500, "Server error.");
            })
            .then(result => {
                if (result) {
                    response(res, result);
                } else {
                    res.status(400).send("No data");
                }
            });
    }
    else {
        res.status(401).send("permission denied");
    }
}

const saveStudentReport = async (req, res) => {
    // 注意student_id和class_id是否存在
    // form内input file的id为upload
    let sid = req.session.loginUser;
    let mid = req.params.class_id;
    if (sid) {
        if (!req.file) { // 没上传文件
            response(res, 400, "Argument error.");
            return;
        }

        if (cfg.EXTENSIONS.indexOf(extname(req.file.originalname).toLowerCase()) == -1) { // 不在允许的扩展名内
            response(res, 400, 'File is not allowed to upload.');
            fs.unlink(req.file.path); // 删掉文件，其实感觉不太对，不应该放在这儿
            return;
        }


        feedback.getReportByStudentIDAndModuleID(sid, mid)
            .then(result => {
                if (result) {
                    // 注意，这里是异步
                    file.removeFile(result.file_id);
                }
                return file.saveFile(req.file.originalname, req.file.path, `student:${sid}`);
            })
            .then(fid => {
                return feedback.upsertReport(sid, mid, fid);
            })
            .then(() => {
                response(res, {});
            })
            .catch(err => {
                //console.log(err);
                response(res, 500, 'Server error.');
            });
    } else {
        res.status(401).send("permission denied");
    }
}

const deleteStudentReport = async (req, res) => {
    let sid = req.session.loginUser;
    let mid = req.params.class_id;
    if (sid) {
        feedback.getReportByStudentIDAndModuleID(sid, mid)
            .then(result => {
                if (result) {
                    file.removeFile(result.file_id)
                        .then(() => {
                            return feedback.removeReport(sid, mid);
                        })
                        .then(() => {
                            response(res, {});
                        })
                        .catch(err => {
                            response(res, 500, 'Server error.');
                        });
                } else {
                    res.status(500).send("No data");
                }
            });
    } else {
        res.status(401).send("permission denied");
    }
}

const getTeacherJudgement = async (req, res, next) => {
    var student_id;
    if (req.session.loginUser &&
        (await UserValidator.getUserTypeById(req.session.loginUser) == 'student')) {
        student_id = req.session.loginUser.toString();
    }
    if (req.session.loginUser &&
        (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher")) {
        student_id = req.params.student_id.toString();
    }
    try {
        var class_id = req.params.class_id;
        feedback.getJudgementByStudentIDAndModuleID(student_id, class_id).then(result => {
            res.json({
                result: {
                    info: {
                        score: result.score,
                        text: result.text
                    }
                }
            });
        });
    } catch (err) {
        FeedbackLogger.error(`controller error => ${err.stack}`)
        next(err);
    }
}

const saveTeacherJudgement = async (req, res) => {
    // 注意student_id和class_id是否存在
    let sid = req.params.student_id;
    let mid = req.params.class_id;
    if (req.session.loginUser && (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher")) {

        // 参数类型检查和范围检查 其实很丑，看看有什么比较好看的解决方案
        if (typeof (req.body.score) == 'number' && typeof (req.body.body == 'string') && (req.body.score >= 0 && req.body.score <= 100)) {
            req.body.score = Math.floor(req.body.score);//取整
            // 注意HTML转义的问题，先尝试在前端解决
            feedback.upsertJudgement(sid, mid, req.body.score, req.body.text)
                .then(() => {
                    response(res, {});
                })
                .catch(err => {
                    response(res, 500, 'Server error.');
                });

        } else {
            response(res, 400, 'Data error.');
        }
    } else {
        response(res, 401, "permission denied");
    }
}

const deleteTeacherJudgement = async (req, res) => {
    let sid = req.params.student_id;
    let mid = req.params.class_id;
    if (req.session.loginUser && (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher")) {
        feedback.removeJudgement(sid, mid)
            .then(() => {
                response(res, {});
            })
            .catch(err => {
                response(res, 500, 'Server error.');
            });
    } else {
        response(res, 401, "permission denied");
    }
}

module.exports = {
    getStudentList,
    getPageByUserType,
    getStudentReport,
    saveStudentReport,
    deleteStudentReport,
    getTeacherJudgement,
    saveTeacherJudgement,
    deleteTeacherJudgement
}
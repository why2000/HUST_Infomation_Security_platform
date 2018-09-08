'use strict'
var feedback = require('../models/feedback_db');
var file = require('../models/file_db');
var response = require('../utils/response');
var extname = require('path').extname;
var cfg = require('../config/feedback.json');
var fs = require('fs');
var UserValidator = require('../validators/user_validator');


const getIndexPage = (req, res) => {

}


/* 
    考虑添加一个全局的ErrorHandler(如果有这种玩意儿)
*/

// *用户验证已经加入
// TODO:尚无入口URL，尤其是教师如何进入
const getIndex = async (req, res) => {

    if (!req.session.loginUser) {
        res.redirect('/');
    } else {
        if (await UserValidator.getUserTypeById(req.session.loginUser) == "student") {
            res.render('report-index');
        }
        // TODO
        /*
        else if (UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
            res.redirect/render('judge-index');
        }
        */
    }
}

const getPageByUserType = (req, res) => {

    if (!req.session.loginUser) {
        res.redirect('/');
    } else {
        UserValidator.getUserTypeById(req.session.loginUser).then(user_type => {
            if (user_type == "student") {
                if (req.params.class_id != 'index') {
                    res.render('report-upload');
                }
                else {
                    res.render('report-index');
                }
            }
            // !未经测试
            else if (UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
                res.redirect('/feedback/judgement/:' + req.params.class_id);
            }
        });
    }
}

const getStudentReport = (req, res) => {
    feedback.getReportByStudentIDAndModuleID(req.session.loginUser, req.params.class_id)
        .catch(err => {
            //need a logger
            response(res, 500, "Server error.");
        })
        .then(result => {
            if (result) {
                response(res, result);
            } else {
                res.status(400);
            }
        });
}

const saveStudentReport = (req, res) => {
    // 注意student_id和class_id是否存在
    // form内input file的id为upload
    let sid = req.session.loginUser;
    let mid = req.params.class_id;

    if (!req.file) { // 没上传文件
        response(res, 400, "Argument error.");
        return;
    }

    if (cfg.EXTENSIONS.indexOf(extname(req.file.originalname).toLowerCase()) == -1) { // 不在允许的扩展名内
        response(res, 400, 'File is not allowed to upload.');
        fs.unlink(req.file.path);// 删掉文件，其实感觉不太对，不应该放在这儿
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
            console.log(err);
            response(res, 500, 'Server error.');
        });
}

const deleteStudentReport = (req, res) => {
    let sid = req.session.loginUser;
    let mid = req.params.class_id;

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
                res.status(400);
            }
        });
}

const getTeacherJudgement = (req, res) => {
    feedback.getJudgementByStudentIDAndModuleID(req.session.loginUser, req.params.class_id)
        .then(result => {

            if (result) {
                res.render('judge-upload', { inputScore: result.score, inputText: result.text, studentName: result.name })
            } else {
                res.status(400);
            }
        })
        .catch(err => {
            response(res, 500, "Server error.");
        });
}

const saveTeacherJudgement = (req, res) => {
    // 注意student_id和class_id是否存在
    let sid = req.session.loginUser;
    let mid = req.params.class_id;

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
}

const deleteTeacherJudgement = (req, res) => {
    let sid = req.session.loginUser;
    let mid = req.params.class_id;

    feedback.removeJudgement(sid, mid)
        .then(() => {
            response(res, {});
        })
        .catch(err => {
            response(res, 500, 'Server error.');
        });
}

module.exports = {
    getIndex,
    getPageByUserType,
    getStudentReport,
    saveStudentReport,
    deleteStudentReport,
    getTeacherJudgement,
    saveTeacherJudgement,
    deleteTeacherJudgement
}
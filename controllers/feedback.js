var feedback = require('../models/feedback');
var file = require('../models/file');
var response = require('../utils/response');
var extname = require('path').extname;
var cfg = require('../config/feedback.json');

/* 
    还有用户认证
    以及，没有考虑到数据库部分的错误
    考虑添加一个全局的ErrorHandler(如果有这种玩意儿a)
*/

const getStudentReport = (req, res) => {
    let result = feedback.getFeedbackByStudentIDAndModuleID(req.params.student_id, req.params.module_id);
    if(result) {
        response(res, result);
    } else {
        response(res, 404, 'Not found.');
    }
}

const saveStudentReport = (req, res) => {
    // 注意student_id和module_id是否存在
    // form内input file的id为upload
    let sid = req.params.student_id;
    let mid = req.params.module_id;
    let result = feedback.getFeedbackByStudentIDAndModuleID(sid, mid);

    if(cfg.EXTENSIONS.indexOf(extname(req.file.upload.name)) == -1) { // 不在允许的扩展名内
        response(res, 400, 'File is not allowed to upload.');
        return;
    }

    if(result) {
        file.removeFile(result.file_id)
        feedback.removeReport(sid, mid);
    }
    let fid = file.saveFile(req.file.upload.name, req.file.upload.path, "student:" + sid);
    feedback.insertReport(sid, mid, fid);

    response(res, {});
}

const deleteStudentReport = (req, res) => {
    let sid = req.params.student_id;
    let mid = req.params.module_id;
    let result = feedback.getFeedbackByStudentIDAndModuleID(sid, mid);

    if(result) {
        file.removeFile(result.file_id)
        feedback.removeReport(sid, mid);
        response(res, {});
    } else {
        response(res, 404, 'Not found.');
    }
}

const getTeacherFeedback = (req, res) => {
    let result = feedback.getFeedbackByStudentIDAndModuleID(req.params.student_id, req.params.module_id);
    if(result) {
        response(res, result);
    } else {
        response(res, 404, 'Not found.');
    }
}

const saveTeacherFeedback = (req, res) => {
    // 注意student_id和module_id是否存在
    let sid = req.params.student_id;
    let mid = req.params.module_id;
    let result = feedback.getFeedbackByStudentIDAndModuleID(sid, mid);

    // 参数类型检查 其实很丑，看看有什么比较好看的解决方案
    if(typeof(req.body.score) == 'number' && typeof(req.body.body == 'string')) {
        if(result) {
            feedback.removeFeedback(sid, mid);
        }
        // 注意HTML转义的问题，先尝试在前端解决
        feedback.insertFeedback(sid, mid, req.body.score, req.body.text);
        response(res, {});
    } else {
        response(res, 400, 'Data error.');
    }
}

const deleteTeacherFeedback = (req, res) => {
    let sid = req.params.student_id;
    let mid = req.params.module_id;
    let result = feedback.getFeedbackByStudentIDAndModuleID(sid, mid);

    if(result) {
        feedback.removeFeedback(sid, mid);
        response(res, {});
    } else {
        response(res, 404, 'Not found.');
    }
}

module.exports = {
    getStudentReport,
    saveStudentReport,
    deleteStudentReport,
    getTeacherFeedback,
    saveTeacherFeedback,
    deleteTeacherFeedback
}
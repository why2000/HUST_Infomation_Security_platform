'use strict';

var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamValidator = require('../validators/exam_validator');
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');
let response = require('../utils/response');



exports.getIndexPage = async (req, res, next) => {
    if(!req.session.loginUser) {
        res.redirect('/');
        return;
    }
    
    var page = "exam";

    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
        page += "_teacher"
    }

    res.render(page);
}

exports.getTimeLimit = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    if (taskindex == "index") {
        res.json({
            result: {
                timelimit: null
            }
        });
    }
    var params = {
        taskindex: taskindex
    }
    try {
        var timelimit = await ExamValidator.getTimeLimit(params);
        res.json({
            result: {
                timelimit: timelimit
            }
        });
    } catch (err) {
        ExamLogger.error(`get time limit error => ${err.stack}`);
        next(err);
    }

}

exports.getInfo = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var params = {
        taskindex: taskindex
    }
    try {
        var info = await ExamValidator.getInfo(params);
    } catch (err) {
        ExamLogger.error(`get info error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            info: info
        }
    });
}


exports.getTaskPage = async (req, res, next) => {
    if(!req.session.loginUser) {
        res.redirect('/');
        return;
    }

    var page = "exam";

    if(UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
        page += '_teacher';
    }

    res.render(page)
}

// TaskList
exports.getTaskList = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var params = {
        "userid": userid
    }
    try {
        var tasklist = await ExamValidator.getTaskList(params);
        res.json({
            result: {
                tasklist: tasklist
            }
        });
    } catch (err) {
        ExamLogger.error(`get task list error => ${err.stack}`);
        next(err);
    }

}


// FavorList
exports.getFavorList = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var params = {
        "userid": userid
    }
    try {
        var favorlist = await ExamValidator.getFavorList(params);
        res.json({
            result: {
                favorlist: favorlist
            }
        });
    } catch (err) {
        ExamLogger.error(`get favor list error => ${err.stack}`);
        next(err);
    }
}


// Favor
exports.getFavor = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var taskindex = req.params.taskindex;
    var params = {
        "taskindex": taskindex,
        "userid": userid
    }
    try {
        var favor = await ExamValidator.getFavor(params);
        res.json({
            result: {
                favor: favor
            }
        });
    } catch (err) {
        ExamLogger.error(`get favor error => ${err.stack}`);
        next(err);
    }

}

exports.postFavor = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var taskindex = req.params.taskindex;
    var params = {
        "favor": req.body.favor,
        "taskindex": taskindex,
        "userid": userid
    }
    try {
        let result = await ExamValidator.postFavor(params);
        ExamLogger.info(`add favor result => ${JSON.stringify(result, null, 2)}`);
        res.json({
            result: result
        });
    } catch (err) {
        ExamLogger.error(`add favor error => ${err.stack}`);
        next(err);
    }
    }

exports.deleteFavor = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var taskindex = req.params.taskindex;
    var params = {
        "favor": req.body.favor,
        "taskindex": taskindex,
        "userid": userid
    }
    try {
        let result = await ExamValidator.deleteFavor(params);
        ExamLogger.info(`delete favor result => ${JSON.stringify(result, null, 2)}`);
        res.json({
            result: result
        });
    } catch (err) {
        ExamLogger.error(`delete favor error => ${err.stack}`);
        next(err);
    }
}



exports.submitTask = async (req, res, next) => {
    if(!req.session.loginUser) {
        response(res, 401, 'Not Login.');
        return;
    }
    var userid = req.session.loginUser;
    var taskindex = req.params.taskindex;
    var params = {
        "taskindex": taskindex,
        "userid": userid
    }
    try {
        var taskinfo = await ExamValidator.getTaskInfo(params);
        res.json({
            result: {
                taskinfo: taskinfo
            }
        });
    } catch (err) {
        ExamLogger.error(`submit task error => ${err.stack}`);
        next(err);
    }

}

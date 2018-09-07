'use strict';

var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamValidator = require('../validators/exam_validator');
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');



exports.getIndexPage = async (req, res, next) => {
    var page = "exam";
    var session = req.session;
    var userid = "U201714635";
    var usertype = "student";
    var info = {
        userid: userid,
        username: "",
        usertype: usertype
    };
    
    if(!req.session.loginUser){
        res.redirect('/');
    }else{
        if(await UserValidator.getUserTypeById(req.session.loginUser) == "teacher"){
            page += "_teacher"
        }
        else if(await UserValidator.getUserTypeById(req.session.loginUser) == "student"){
            ;
        }
        res.render(page);
    }
}

exports.getTimeLimit = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    if(taskindex == "index"){
        res.json({
            result:{
                timelimit: null
            }
        });
    }
    var params = {
        taskindex: taskindex
    }
    try{
        var info = await ExamValidator.getTimeLimit(params);
    }catch(err){
        ExamLogger.error(`get time limit error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            timelimit: timelimit
        }
    });
}

exports.getInfo = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var params = {
        taskindex: taskindex
    }
    try{
        var info = await ExamValidator.getInfo(params);
    }catch(err){
        ExamLogger.error(`get info error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            info: info
        }
    });
}

// UserName
exports.getUserNameById = async (req, res, next) => {
    var userid = "U201714635";
    res.json({
        result: {
            username: test
        }
    });
    try{
        var username = await UserValidator.getUserNameById(userid);
    }catch(err){
        ExamLogger.error(`get username error => ${err.stack}`);
        next(err);
    }
    // console.log(favorlist);
    res.json({
        result: {
            username: username
        }
    });
}

exports.getTaskPage = async (req, res, next) => {
    var page = "exam";
    var taskindex = req.params.taskindex.toString(); // String
    var success;
    var userid = "U201714635";
    var usertype = "student";
    var taskindex = req.params.taskindex;
    var info = {
        userid: userid,
        username: "",
        usertype: usertype
    };
    if (req.cookies.teacher) {
        success = await UserValidator.createUser(info);
        page += "_teacher"
    } else if (req.cookies.student) {
        success = await UserValidator.createUser(info);
    } else {
        //这里改成redirect: /
        // res.redirect("/");
    }
    res.render(page);
}

// TaskList
exports.getTaskList = async (req, res, next) => {
    var userid = "U201714635";
    var params = {
        "userid": userid
    }
    try{
        var tasklist = await ExamValidator.getTaskList(params);
    }catch(err){
        ExamLogger.error(`get task list error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            tasklist: tasklist
        }
    });
}


// FavorList
exports.getFavorList = async (req, res, next) => {
    var userid = "U201714635";
    var params = {
        "userid": userid
    }
    try{
        var favorlist = await ExamValidator.getFavorList(params);
    }catch(err){
        ExamLogger.error(`get favor list error => ${err.stack}`);
        next(err);
    }
    // console.log(favorlist);
    res.json({
        result: {
            favorlist: favorlist
        }
    });
}


// Favor
exports.getFavor = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var userid = "U201714635";
    var params = {
        "taskindex": taskindex,
        "userid": userid
    }
    try{
        var favor = await ExamValidator.getFavor(params);
    }catch(err){
        ExamLogger.error(`get favor error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            favor: favor
        }
    });
}

exports.postFavor = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var userid = "U201714635";
    var params = {
        "favor": req.body.favor,
        "taskindex": taskindex,
        "userid": userid
    }
    //console.log(req.body);
    try {
        let result = await ExamValidator.postFavor(params);
        ExamLogger.info(`add favor result => ${JSON.stringify(result, null, 2)}`);
        res.json({
            "result": result
        });
    } catch (err) {
        ExamLogger.error(`add favor error => ${err.stack}`);
        next(err);
    }
}

exports.deleteFavor = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var userid = "U201714635";
    var params = {
        "favor": req.body.favor,
        "taskindex": taskindex,
        "userid": userid
    }
    //console.log(req.body);
    try {
        let result = await ExamValidator.deleteFavor(params);
        ExamLogger.info(`delete favor result => ${JSON.stringify(result, null, 2)}`);
        res.json({
            "result": result
        });
    } catch (err) {
        ExamLogger.error(`delete favor error => ${err.stack}`);
        next(err);
    }
}

exports.getTaskInfo = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var userid = "U201714635";
    var params = {
        "taskindex": taskindex,
        "userid": userid
    }
    try{
        var taskinfo = await ExamValidator.getTaskInfo(params);
    }catch(err){
        ExamLogger.error(`get taskinfo error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            taskinfo: taskinfo
        }
    });
}

exports.submitTask = async (req, res, next) => {
    var taskindex = req.params.taskindex;
    var userid = "U201714635";
    var params = {
        "taskindex": taskindex,
        "userid": userid
    }
    try{
        var taskinfo = await ExamValidator.getTaskInfo(params);
    }catch(err){
        ExamLogger.error(`submit task error => ${err.stack}`);
        next(err);
    }
    res.json({
        result: {
            taskinfo: req.body
        }
    });
}
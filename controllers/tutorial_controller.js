'use strict';

var express = require('express');
var router = express.Router();
let TutorialLogger = require('../logger').TutorialLogger;
let TutorialValidator = require('../validators/tutorial_validator');
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');



exports.getIndexPage = async (req, res, next) => {
  var page = "tutorial";
  var session = req.session;
  var userid = "U201714635";
  var usertype = "student";
  var info = {
    userid: userid,
    username: "",
    usertype: usertype
  };

  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
      page += "_teacher"
    } else if (await UserValidator.getUserTypeById(req.session.loginUser) == "student") {;
    }
    res.render(page);
  }
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
    var timelimit = await TutorialValidator.getTimeLimit(params);
    res.json({
      result: {
        timelimit: timelimit
      }
    });
  } catch (err) {
    TutorialLogger.error(`get time limit error => ${err.stack}`);
    next(err);
  }

}

exports.getInfo = async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var params = {
    taskindex: taskindex
  }
  try {
    var info = await TutorialValidator.getInfo(params);
    res.json({
      result: {
        info: info
      }
    });
  } catch (err) {
    TutorialLogger.error(`get info error => ${err.stack}`);
    next(err);
  }

}



exports.getTaskPage = async (req, res, next) => {
  var page = "tutorial";
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
  try {
    var tasklist = await TutorialValidator.getTaskList(params);
    res.json({
      result: {
        tasklist: tasklist
      }
    });
  } catch (err) {
    TutorialLogger.error(`get task list error => ${err.stack}`);
    next(err);
  }

}


// FavorList
exports.getFavorList = async (req, res, next) => {
  var userid = "U201714635";
  var params = {
    "userid": userid
  }
  try {
    var favorlist = await TutorialValidator.getFavorList(params);
    res.json({
      result: {
        favorlist: favorlist
      }
    });
  } catch (err) {
    TutorialLogger.error(`get favor list error => ${err.stack}`);
    next(err);
  }
  // console.log(favorlist);
  
}


// Favor
exports.getFavor = async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params = {
    "taskindex": taskindex,
    "userid": userid
  }
  try {
    let favor = await TutorialValidator.getFavor(params);
    res.json({
      result: {
        favor: favor
      }
    });
  } catch (err) {
    TutorialLogger.error(`get favor error => ${err.stack}`);
    next(err);
  }

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
    let result = await TutorialValidator.postFavor(params);
    TutorialLogger.info(`add favor result => ${JSON.stringify(result, null, 2)}`);
    res.json({
      "result": result
    });
  } catch (err) {
    TutorialLogger.error(`add favor error => ${err.stack}`);
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
    let result = await TutorialValidator.deleteFavor(params);
    TutorialLogger.info(`delete favor result => ${JSON.stringify(result, null, 2)}`);
    res.json({
      "result": result
    });
  } catch (err) {
    TutorialLogger.error(`delete favor error => ${err.stack}`);
    next(err);
  }
}



exports.submitTask = async (req, res, next) => {
  var taskindex = req.params.taskindex;
  var userid = "U201714635";
  var params = {
    "taskindex": taskindex,
    "userid": userid
  }
  try {
    var taskinfo = await TutorialValidator.getTaskInfo(params);
    res.json({
      result: {
        taskinfo: req.body
      }
    });
  } catch (err) {
    TutorialLogger.error(`submit task error => ${err.stack}`);
    next(err);
  }

}
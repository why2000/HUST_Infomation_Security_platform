let ExamDB = require('../models/exam_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let ExamLogger = require('../logger').ExamLogger;


async function _validatetaskindex(params){
    var indexPattern = /^[0-9]{1,50}$/;
    if(indexPattern.test(params)){
        return true;
    }
    return false;
}

// Debug，直接返回true
async function _validateuserid(params){
    var indexPattern = /^[0-9]{1,50}$/;
    if(indexPattern.test(params)){
        return true;
    }
    return true;
}

async function _validatefavortype(params){
    if(typeof params == 'boolean'){
        return true;
    }
    console.log(params);
    return false;
}

// Favor
exports.getFavor = async params => {
    var favor = false;
    // console.log(typeof favor);
    if(!await _validatetaskindex(params.taskindex)||!await _validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
    }else{
        favor = await ExamDB.getFavor(params);
    }
    return favor;
}

exports.postFavor = async params => {
    if(!await _validatetaskindex(params.taskindex)||!await _validateuserid(params.userid)||!await _validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else{
        return await ExamDB.postFavor(params);
    }
    
}

exports.deleteFavor = async params => {
    if(!await _validatetaskindex(params.taskindex)||!await _validateuserid(params.userid)||!await _validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else {
        return await ExamDB.deleteFavor(params);
    }
}


// TaskInfo
exports.getTaskInfo = async params => {
    return null;
}

// TaskList
exports.getTaskList = async params => {
    if(!await _validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await ExamDB.getTaskList(params);
    }
}


// FavorList
exports.getFavorList = async params => {
    if(!await _validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await ExamDB.getFavorList(params);
    }
}




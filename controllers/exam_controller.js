let ExamDB = require('../models/exam_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let ExamLogger = require('../logger').ExamLogger;
let Validator = require('./validator');






// Favor
exports.getFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
    }else{
        return await ExamDB.getFavor(params);
    }
    
}

exports.postFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)||!await Validator._validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else{
        return await ExamDB.postFavor(params);
    }
    
}

exports.deleteFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)||!await Validator._validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else {
        return await ExamDB.deleteFavor(params);
    }
}

// IndexInfo
exports.getIndexInfo = async params => {
    return await ExamDB.getIndexInfo(params);
}



// TaskInfo
exports.getTaskInfo = async params => {
    return null;
}

// TaskList
exports.getTaskList = async params => {
    if(!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await ExamDB.getTaskList(params);
    }
}


// FavorList
exports.getFavorList = async params => {
    if(!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await ExamDB.getFavorList(params);
    }
}




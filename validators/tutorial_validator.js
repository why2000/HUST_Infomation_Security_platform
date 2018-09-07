let TutorialDB = require('../models/tutorial_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let TutorialLogger = require('../logger').TutorialLogger;
let Validator = require('./validator');






// Favor
exports.getFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
    }else{
        return await TutorialDB.getFavor(params);
    }
    
}

exports.postFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)||!await Validator._validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false
    }else{
        return await TutorialDB.postFavor(params);
    }
    
}

exports.deleteFavor = async params => {
    if(!await Validator._validatetaskindex(params.taskindex)||!await Validator._validateuserid(params.userid)||!await Validator._validatefavortype(params.favor)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false
    }else {
        return await TutorialDB.deleteFavor(params);
    }
}

// Info
exports.getInfo = async params => {
    if(params.taskindex != 'index' && !await Validator._validatetaskindex(params.taskindex)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false
    }else {
        return await TutorialDB.getInfo(params);
    }
}

exports.getTimeLimit = async params => {
    if(params.taskindex != 'index' && !await Validator._validatetaskindex(params.taskindex)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false
    }else {
        return await TutorialDB.getTimeLimit(params);
    }
}




// TaskList
exports.getTaskList = async params => {
    if(!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await TutorialDB.getTaskList(params);
    }
}


// FavorList
exports.getFavorList = async params => {
    if(!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        TutorialLogger.error(`controller error => ${err.stack}`);
        return false;
    }else{
        return await TutorialDB.getFavorList(params);
    }
}



// Score Caculator
exports.scoreCaculator = async params => {
    if(!await Validator._validatemessage(params)){
        
    }
}
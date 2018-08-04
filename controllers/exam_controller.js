let ExamDB = require('../models/exam_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let ExamLogger = require('../logger').ExamLogger;


async function _validateclassindex(params){
    var indexPattern = /^[0-9]{1,50}$/;
    if(indexPattern.test(params)){
        return true;
    }
    return false
}



exports.getFavor = async params => {
    var favor = null;
    // console.log(params.classindex);
    if(!await _validateclassindex(params.classindex)){
        favor = null;
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.BAD_CLASS_INDEX);
        ExamLogger.error(`controller error => ${err.stack}`);
    }else{
        favor = await ExamDB.getFavor(params);
    }
    return favor;
}

exports.postFavor = async params => {
    if(!await _validateclassindex(params.classindex)){
        favor = null;
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.BAD_CLASS_INDEX);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else{
        return await ExamDB.postFavor(params);
    }
    
}

exports.deleteFavor = async params => {
    if(!await _validateclassindex(params.classindex)){
        favor = null;
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.BAD_CLASS_INDEX);
        ExamLogger.error(`controller error => ${err.stack}`);
        return false
    }else{
        return await ExamDB.deleteFavor(params);
    }
}

exports.getClassInfo = async params => {
    return null;
}





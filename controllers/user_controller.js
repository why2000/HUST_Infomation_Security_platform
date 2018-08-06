'use strict';

let UserDB = require('../models/user_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let UserLogger = require('../logger').UserLogger;
let Validator = require('./validator');


exports.createUser = async params => {
    if (!await Validator._checkuserexists(params)) {
        let data = await UserDB.createUser(params);
        return data;
    }
    return false;
}

// UserName
exports.getUserName = async params => {
    var favor = false;
    // console.log(typeof favor);
    if(!await Validator._validateuserid(params.taskindex)||!await Validator._validateuserid(params.userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ExamLogger.error(`controller error => ${err.stack}`);
    }else{
        var user = await UserDB.findUserById(params.userid);
        var username = user.username;
    }
    return username;
}



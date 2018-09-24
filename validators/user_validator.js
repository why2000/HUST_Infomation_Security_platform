'use strict';

let UserDB = require('../models/user_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let UserLogger = require('../logger').UserLogger;
let Validator = require('./validator');


exports.loginCheck = async params => {
    var userid = params.userid;
    var password = params.password;
    //if(userid == '123' && password == '123')
    //return true;
    
    if(!await Validator._validateuserid(userid)||!await Validator._validatepassword(password)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user_info = await UserDB.findUserById(userid);
        if(user_info){
            if(user_info.password == password){
                return true;
            }
        }else{
            return false;
        }
    }
    return false;
}

//UserType
exports.getUserTypeById = async userid => {
    if(!await Validator._validateuserid(userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user = await UserDB.findUserById(userid);
        if(user){
            return user.usertype;
        }
    }
    return null
}

// UserName
exports.getUserNameById = async userid => {
    if(!await Validator._validateuserid(userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user = await UserDB.findUserById(userid);
        var username = user.username;
    }
    return username;
}



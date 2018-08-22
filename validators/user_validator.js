'use strict';

let UserDB = require('../models/user_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let UserLogger = require('../logger').UserLogger;
let Validator = require('./validator');


exports.loginCheck = async params => {
    console.log(params);
    var userid = params.userid;
    var password = params.password;
    if(!await Validator._validateuserid(userid)||!await Validator._validatepassword(password)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user_info = await UserDB.findUserById(userid);
        if(user_info){
            // console.log(user_info)
            if(user_info.password == password){
                return true;
            }
        }else{
            console.log(user_info);
        }
    }
    return false;
}


//UserType
exports.getUserTypeById = async userid => {
    // console.log(typeof favor);
    if(!await Validator._validateuserid(userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user = await UserDB.findUserById(userid);
        // console.log(user);
        if(user){
            return user.usertype;
        }
    }
    return null
}


// UserName
exports.getUserNameById = async userid => {
    // console.log(typeof favor);
    if(!await Validator._validateuserid(userid)){
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        UserLogger.error(`controller error => ${err.stack}`);
    }else{
        var user = await UserDB.findUserById(userid);
        var username = user.username;
    }
    return username;
}



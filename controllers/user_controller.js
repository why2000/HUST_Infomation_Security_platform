'use strict';

let UserDB = require('../models/user_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let UserLogger = require('../logger').UserLogger;

async function _checkuserexists(params) {
    username = params.username;
    return UserDB.findUser(username);
}

exports.createUser = async params => {
    if (!await _checkuserexists(params)) {
        let data = await UserDB.createUser(params);
        return data;
    }
    return false;
}


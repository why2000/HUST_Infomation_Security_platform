'use strict';

let ContactDB = require('../models/contact_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');
let ContactLogger = require('../logger').ContactLogger;
let Validator = require('./validator');


exports.sendInf = async params => {
    if (!await Validator._validateSendContactParams(params)) {
        var err = ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
        ContactLogger.error(`controller error => ${err.stack}`);
        throw err;
    }
    let data = await ContactDB.sendInf(params);
    return data;
}

exports.getAllInf = async params => {
    let data = await ContactDB.getAllInf(params);
    return data;
}


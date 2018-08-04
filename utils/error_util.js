'use strict';

exports.createError = function (errorObject) {
    let err = new Error(errorObject.message);
    err.status = errorObject.status;
    err.msg = errorObject.message;
    return err;
};

module.exports.ErrorSet = {
    REQUEST_PARAMETER_ERROR: {status: 600, message: 'request parameter error'},
    NOT_IMPLEMENTED_ERROR: {status: 601, message: 'not implemented'},
    DELETE_FAILED: {status: 602, message: 'failed to delete'},
    TOO_MUCH_CONTACT: {status: 603, message: 'failed to add contact: too much here'},
    BAD_CLASS_INDEX: {status: 604, message: 'illegal class index detected'},
    BAD_USER_ID: {status: 605, message: 'illegal user id detected'},
    
    
};
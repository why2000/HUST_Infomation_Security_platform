'use strict'


/* User */
exports._checkuserexists = async params => {
    var username = params.username;
    return UserDB.findUser(username);
}


/* Exam */
exports._validatetaskindex = async params => {
    var indexPattern = /^[0-9]{1,50}$/;
    if(indexPattern.test(params)){
        return true;
    }
    return false;
}

// Debug，直接返回true
exports._validateuserid = async params => {
    var indexPattern = /^[0-9]{1,50}$/;
    if(indexPattern.test(params)){
        return true;
    }
    return true;
}

exports._validatefavortype = async params => {
    if(typeof params == 'boolean'){
        return true;
    }
    console.log(params);
    return false;
}


/* contact */
exports._validateSendContactParams = async params => {
    var emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/,
        namePattern = /^[\u4E00-\u9FA5A-Za-z\ ]{1,20}$/,
        messagefailPattern = /^<\/?[^>]*>$|^[\'\"]+$/,
        messagePattern = /^.{10,2000}$/;
        //console.log(`email => ${params.email}`);
        //console.log(`phone => ${params.phone}`);
        //console.log(`name => ${params.name}`);
    if(namePattern.test(params.name) && !messagefailPattern.test(params.message) && messagePattern.test(params.message) && emailPattern.test(params.email)) {
        //console.log("name phone gotcha");
        return true
    }
    return false;
}

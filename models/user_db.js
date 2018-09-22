'use strict';

let ConfigSet = require('../config/user.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let UserLogger = require('../logger').UserLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');


let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        UserLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function (err, res) {
            if (err) {
                UserLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
        });
    }
})

const getStudentListByTeaID = async function (teacherID) {
    var user = db.collection('user');
    try {
        var teacherData = await user.findOne({ type: 'user-info', userid: teacherID });
        var studentList =teacherData.list;
    } catch (err) {
        UserLogger.error(`database error => ${err.stack}`);
        throw err
    }
    return studentList;
}

const changeUserData = async function (data) {
    var user = db.collection('user');
    await user.update({ userid: data.uid }, { $set: { username: data.name, password: data.pwd } }, function (err, res) {
        if (err) {
            UserLogger.error(`database error => ${err.stack}`);
            throw err
        }
    });
    return true;
}

const findUserByName = async function (username) {
    var user = db.collection('user');
    var doc = user.find({ type: 'user-info', username: username });
    if (!doc) {
        return false;
    }
    else {
        return doc;
    }
}

const findUserById = async function (userid) {
    var user = db.collection('user');
    try {
        var result = await user.findOne({ type: 'user-info', userid: userid });
    } catch (err) {
        UserLogger.error(`database error => ${err.stack}`);
        throw err
    }
    return result;
}

module.exports = {
    findUserByName,
    findUserById,
    getStudentListByTeaID,
    changeUserData
}

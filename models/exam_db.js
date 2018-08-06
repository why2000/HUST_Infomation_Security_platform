'use strict';

let ConfigSet = require('../config/exam.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let ExamLogger = require('../logger').ExamLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function(err, res) {
            if (err) {
                ExamLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                //console.log("Successfully creat col");
                ;
            }
          });
    }
})

function getTime(){
    var time = new Date();
    var timeinfo = {
        "timestamp": time.valueOf(),
        "year": time.getFullYear(),
        "month": time.getMonth(),
        "date": time.getDate()
    }
    return timeinfo;
}


// Favor
exports.getFavor = async params => {
    var exam = db.collection('exam');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var whyere = {
        "type": "task-favor",
        "taskindex": taskindex,
        "userid": userid
    };
    var favor = false;
    try{
        var result = await exam.findOne(whyere, {"favor": 1});
    } catch(err){
        ExamLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    if(result){
        favor = true;
    }
    else{
        favor = false;
    }
    // console.log(result);
    // console.log(whyere);
    return favor;
}

exports.postFavor = async params => {
    var exam = db.collection('exam');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var taskname = params.taskname;
    var data = {
        "type": "task-favor",
        "taskindex": taskindex,
        "userid": userid,
        "favor": true
    };
    exam.insert(data, function(err, res){
        if(err){
            ExamLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = res;
        }
    });
    return data
}

exports.deleteFavor = async params => {
    var exam = db.collection('exam');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var data = {
        "taskindex": taskindex,
        "userid": userid,
        "favor": true
    }
    exam.deleteMany(data, function(err, res){
        if(err){
            ExamLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = res;
        }
    });
    return data
}


// TaskList
exports.getTaskList = async params => {
    var exam = db.collection('exam');
    var whyere = {
        "type": "task-name"
    };
    var result;
    await exam.find(whyere, {"index": 1, "name": 1}, function(err, res) {
        if (err) {
            ExamLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            result = res.toArray();
        }
    });
    // console.log(result);
    // console.log(whyere);
    return result;
}


//FavorList
exports.getFavorList = async params => {
    var exam = db.collection('exam');
    var userid = params.userid;
    var whyere = {
        "type": "task-favor",
        "userid": userid
    };
    try{
        var indexes = await exam.find(whyere, {"index": 1, "name":  1}).toArray();
    } catch(err){
        ExamLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    var favors = new Array();
    var length = 0;
    if(indexes){
        length = indexes.length;
    }
    // console.log(length);
    for(var i = 0; i < length; i++){
        var single = indexes[i];
        var index = parseInt(single.taskindex);
        var namewhere = {
            "type": "task-name",
            "index": index.toString()
        };
        try{
            var namecol = await exam.findOne(namewhere, {"index": 1, "name": 1});
        } catch(err){
            ExamLogger.error(`database error => ${err.stack}`);
            throw err;
        }
        favors[index] = {
            "index": namecol.index,
            "name": namecol.name
        }
    }
    
    var result = favors.filter( function(currentValue) { 
        return currentValue && currentValue!= null && currentValue != undefined;
    });
    // console.log(result);
    return result;
}

// IndexInfo
exports.getIndexInfo = async params => {
    var exam = db.collection('exam');
    var whyere = {
        "type": "index-info"
    }
    try{
        var result = await exam.findOne(whyere);
    } catch(err){
        ExamLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    return result;
}
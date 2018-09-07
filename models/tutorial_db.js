'use strict';

let ConfigSet = require('../config/tutorial.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let TutorialLogger = require('../logger').TutorialLogger;
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
                TutorialLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                //console.log("Successfully creat col");
                ;
            }
          });
    }
});

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
const getFavor = async params => {
    var tutorial = db.collection('tutorial');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var whyere = {
        "type": "task-favor",
        "taskindex": taskindex,
        "userid": userid
    };
    var favor = false;
    try{
        var result = await tutorial.findOne(whyere, {"favor": 1});
    } catch(err){
        TutorialLogger.error(`database error => ${err.stack}`);
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

const postFavor = async params => {
    var tutorial = db.collection('tutorial');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var taskname = params.taskname;
    var data = {
        "type": "task-favor",
        "taskindex": taskindex,
        "userid": userid,
        "favor": true
    };
    tutorial.insert(data, function(err, res){
        if(err){
            TutorialLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = res;
        }
    });
    return data
}

const deleteFavor = async params => {
    var tutorial = db.collection('tutorial');
    var taskindex = params.taskindex;
    var userid = params.userid;
    var data = {
        "taskindex": taskindex,
        "userid": userid,
        "favor": true
    }
    tutorial.deleteMany(data, function(err, res){
        if(err){
            TutorialLogger.error(`database error => ${err.stack}`);
            throw err;
        } else {
            data = res;
        }
    });
    return data
}


// TaskList
const getTaskList = async params => {
    var tutorial = db.collection('tutorial');
    async function foo(pass){
        var test = {
        type: "index-info",
        content: [
            {
                type: "text",
                text: "因主校区东边泵房升级改造施工，定于8月3日23:30——8月4日2:00停水，主校区大部分区域停水（喻园小区、西边高层小区、紫菘学生公寓与紫菘教师小区不受影响），请各单位和各住户做好储水备用，早完工，早送水，不便之处敬请谅解。",
                indents: 0,
            },
            {
                type: "text",
                text: "",
                indents: 0,
            },
            {
                type: "sc",
                text: "测试单选",
                indents: 0,
                options: [
                    {
                        src: "",
                        text: "第一个答案测试",
                        choice: "A"
                    },
                    {
                        src: "",
                        text: "第二个答案测试",
                        choice: "B"
                    }
                ]
            },
            {
                type: "text",
                text: "后勤集团建安总公司",
                indents: 15,
            },
            {
                type: "text",
                text: "2018年8月3日",
                indents: 15,
            },
            {
                type: "mc",
                text: "测试多选题如果很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
                indents: 0,
                options:[
                    {
                        text: "第一个多选项",
                        choice: "A"
                    },
                    {
                        text: "第二个",
                        choice: "B"
                    }
                ]
            },
            {
                type: "img",
                src: "",
            },
            {
                type: "fb",
                text: "这是一道_____题",
                indents: 0,
                options: [
                    {
                        src: "",
                        text: "",
                        choice: "1"
                    }
                ]
            }
        ],
        title: '主校区短时停水通知',
        author: 'why',
        category: '通知',
        time: '2018-08-03 15:52',
        hot: '111'
    }
        await tutorial.insertOne(test);
    }
    // await foo();
    var whyere = {
        "type": "task-name"
    };
    var result;
    await tutorial.find(whyere, {"index": 1, "name": 1}, function(err, res) {
        if (err) {
            TutorialLogger.error(`database error => ${err.stack}`);
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
const getFavorList = async params => {
    var tutorial = db.collection('tutorial');
    var userid = params.userid;
    var whyere = {
        "type": "task-favor",
        "userid": userid
    };
    try{
        var indexes = await tutorial.find(whyere, {"index": 1, "name":  1}).toArray();
    } catch(err){
        TutorialLogger.error(`database error => ${err.stack}`);
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
        // console.log(namewhere)
        try{
            var namecol = await tutorial.findOne(namewhere, {"index": 1, "name": 1});
            // console.log(namecol)
            favors[index] = {
                "index": namecol.index,
                "name": namecol.name
            }
        } catch(err){
            TutorialLogger.error(`database error => ${err.stack}`);
            throw err;
        }

    }
    
    var result = favors.filter( function(currentValue) { 
        return currentValue && currentValue!= null && currentValue != undefined;
    });
    // console.log(result);
    return result;
}

// IndexInfo
const getInfo = async params => {
    var tutorial = db.collection('tutorial');
    if(params.taskindex == "index"){
        var whyere = {
            "type": "index-info"
        }
    }
    else{
        var whyere = {
            "type": "tutorial-info",
            "taskindex": params.taskindex
        }
    }
    try{
        var result = await tutorial.findOne(whyere, {"_id": 0});
    } catch(err){
        TutorialLogger.error(`database error => ${err.stack}`);
        throw err;
    }
    return result;
}

const getTimeLimit = async params => {

}

module.exports = {
    getFavor,
    postFavor,
    deleteFavor,
    getTaskList,
    getFavorList,
    getInfo,
    getTimeLimit
}
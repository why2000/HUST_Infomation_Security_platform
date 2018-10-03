'use strict';

let ConfigSet = require('../config/tutorial.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let TutorialLogger = require('../logger').TutorialLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');

let db = new MongoDB.Db;

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
                // Successfully creat col
                ;
            }
          });
    }
});


/**
 * 获取课程ID下的所有教学列表
 * @param {string} course_id 课程ID
 */
const getTutorialListByCourseID = async (course_id) => {
    let colTutorial = db.collection('tutorial');
    let cid = MongoDB.ObjectId(course_id);
    return colTutorial.find({
        course_id: cid
    })
    .project({
        course_id: 0,
        video: 0,
        description: 0
    })
    .toArray();
}

/**
 * 通过课程和教程ID获得课程详细信息
 * @param {string} course_id 课程ID
 * @param {string} tutorial_id 教程ID
 */
const getTutorialByIDs = async (course_id, tutorial_id) => {
    let colTutorial = db.collection('tutorial');
    let cid = MongoDB.ObjectId(course_id),
        tid = MongoDB.ObjectId(tutorial_id);

    return colTutorial.findOne({
        _id: tid,
        course_id: cid
    })
    .then(r => {
        if(!r) return null;
        return {
            title: r.title,
            video: r.video,
            description: r.description
        }
    });
}

/**
 * 删除课程下的某个教学
 * @param {string} course_id 
 * @param {string} tutorial_id 
 */
const deleteTutorial = async (course_id, tutorial_id) => {
    let colTutorial = db.collection('tutorial');
    let cid = MongoDB.ObjectId(course_id),
    tid = MongoDB.ObjectId(tutorial_id);

    return colTutorial.deleteOne({
        _id: tid,
        course_id: cid
    })
    .then(r => r.result.ok == 1);
}


/**
 * 上传教学视频
 * @param {string} course_id 
 * @param {{title: string, video: string, description: string} data 
 */
const saveTutorial = async (course_id, data) => {
    let colTutorial = db.collection('tutorial');
    data.course_id = MongoDB.ObjectId(course_id);

    return colTutorial.insertOne(data)
           .then(r => r.result.ok == 1);
}

module.exports = {
    getTutorialListByCourseID,
    getTutorialByIDs,
    saveTutorial,
    deleteTutorial
}
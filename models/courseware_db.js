'use strict';

let ConfigSet = require('../config/courseware.json');
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let fs = require('fs');
let path = require('path')

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function (err, res) {
            if (err) {
                ContactLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                //console.log("Successfully creat col");
            }
        });
    }
})

const getCoursewareStatusByCourseID = async function (course_id) {
    var collection = db.collection('coursefile');
    return collection.find({
        course_id: course_id
    }).toArray();
}

const getAllCoursewareStatus = async function () {
    var collection = db.collection('coursefile');
    return collection.find().toArray();
}

const getCoursewareStatusByFileID = async function (file_id) {
    var collection = db.collection('coursefile');
    return collection.findOne({
        file_id: file_id
    });
}

const removeFile = async function (file_id) {
    var collection = db.collection('coursefile');
    return collection.deleteOne({
        file_id: file_id
    }).then(res => res.result.ok == 1);
}

const uploadFile = async function (course_id, file_id, file_name) {
    var collection = db.collection('coursefile');
    return collection.insertOne({
        course_id: course_id,
        file_id: file_id,
        file_name: file_name
    }).then(res => res.result.ok == 1);
}

module.exports = {
    getAllCoursewareStatus,
    uploadFile,
    removeFile,
    getCoursewareStatusByCourseID,
    getCoursewareStatusByFileID
}

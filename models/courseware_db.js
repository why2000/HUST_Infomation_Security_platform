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
                ;
            }
        });
    }
})

const getAllCoursewareStatus = async function () {
    var collection = db.collection('coursefile');
    return await collection.find().toArray();
}

const getCoursewareFileStatusByCourseID = async function (course_id) {
    var collection = db.collection('coursefile');
    return collection.findOne({
        course_id: course_id
    })
}

const removeFile = async function (file_path, course_id) {
    var collection = db.collection('coursefile');
    fs.unlinkSync(path.join(file_path, course_id));
    return collection.updateOne({
        course_id: course_id
    }, {
            $set: {
                name: "",
                status: false
            }
        }, {
            upsert: true
        }).then(res => res.result.ok == 1);
}

const uploadFile = async function (target_path, origin_name, tmp_path, course_id) {
    var collection = db.collection('coursefile');
    fs.renameSync(tmp_path, path.join(target_path, course_id));
    return collection.updateOne({
        course_id: course_id
    }, {
            $set: {
                name: origin_name,
                status: true
            }
        }, {
            upsert: true
        }).then(res => res.result.ok == 1);
}


module.exports = {
    getAllCoursewareStatus,
    uploadFile,
    removeFile,
    getCoursewareFileStatusByCourseID
}

'use strict'

let ConfigSet = require('../config/feedback.json');
let ErrorSet = require('../utils/error_util');
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;

var fs = require('fs');
var path = require('path')
var crypto = require('crypto');
var cfg = require('../config/file.json');

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
        db.createCollection(ConfigSet.COLLECTION_NAME, function(err, res) {
            if (err) {
                FeedbackLogger.error(`database error => ${err.stack}`);
                throw err;
            } else {
                // Successfully creat col
                ;
            }
          });
    }
});

// 判断文件保存目录是否存在，不存在则创建
// mkdir必须跟一回调，否者报错
if(!fs.existsSync(path.resolve(cfg.PATH))) {
    fs.mkdir(path.resolve(cfg.PATH),function(){});
}

/**
 * 生成FileID
 * @param {string} file_name 
 */
const genFileID = (file_name) => {
    let salt = Math.random().toString().slice(4, 9); // 盐
    let s = file_name + salt;
    let md5 = crypto.createHash('md5');
    return md5.update(s).digest('hex').slice(9, 17);
}

/**
 * 获得全部已上传的文件
 */
const getAllFiles = async () => {
    let colFiles = db.collection('file');
    return colFiles.find({}).project({_id: 0}).toArray();
}


/**
 * 获得文件
 * 如果没找到文件则返回null
 * @param {string} file_id 文件ID
 */
const getFile = async (file_id) => {
    var colFiles = db.collection('file');
    return colFiles.findOne({file_id: file_id})
           .then(res => {
               if(res) {
                    let stream = fs.createReadStream(path.join(cfg.PATH, file_id))
                    return {
                        name: res.name,
                        stream: stream
                    }
               } else {
                   return null;
               }
           });
}

/**
 * 保存文件并返回文件ID
 * @param {string} file_name 文件名
 * @param {string} tmp_path 文件存储的临时目录
 * @param {string} uploader 上传者
 */
const saveFile = async (file_name, tmp_path, uploader) => {
    // return some file_id
    let colFiles = db.collection('file');
    let file_id = genFileID(file_name);
    fs.renameSync(tmp_path, path.join(cfg.PATH, file_id));
    return colFiles.insertOne({name: file_name, file_id: file_id, uploader: uploader})
           .then(() => file_id)
}

/**
 * 删除文件
 * @param {string} file_id 
 */
const removeFile = async (file_id) => {
    var colFiles = db.collection('file');
    
    return colFiles.deleteOne({file_id: file_id})
           .then(res => {
                fs.unlink(path.join(cfg.PATH, file_id), err => {})
           })
           .then(() => true)
}

/**
 * 通过文件ID返回文件名
 * @param {string} file_id 
 */
const getFileNameByID = async (file_id) => {
    var colFiles = db.collection('file');
    return colFiles.findOne({file_id: file_id})
    .then(res => res ? res.name : null);
}

module.exports = {
    getAllFiles,
    getFile,
    saveFile,
    removeFile,
    getFileNameByID
}
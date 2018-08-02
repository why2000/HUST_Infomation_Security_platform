var db = require('./db');
var fs = require('fs');
var crypto = require('crypto');
var cfg = require('../config/file.json');

//TODO: 未完成

// 生成FileID
const genFileID = async (file_name) => {
    let salt = Math.random().toString().slice(4, 9); // 盐
    let s = file_name + salt;
    let md5 = crypto.createHash('md5');
    return md5.update(s).digest('hex').slice(9, 17);
}

// 获得全部已上传的文件
const getAllFiles = async () => {
    var colFiles = db.collection('IS_Files');
    return colFiles.find({}).project({name: 1, file_id: 1, uploader: 1}).toArray();
}

/* 获得文件
{
    name: String,
    stream: Stream
}
*/
const getFile = async (file_id) => {
    var colFiles = db.collection('IS_Files');
    colFiles.findOne()
}

// 保存文件，返回一个file_id
const saveFile = async (file_name, tmp_path, uploader) => {
    // return some file_id
    return "somefileid"
}

// 删除文件
const removeFile = async (file_id) => {
    var colFiles = db.collection('IS_Files');
    
    return colFiles.deleteOne({file_id: file_id});
}

module.exports = {
    getAllFiles,
    getFile,
    saveFile,
    removeFile
}
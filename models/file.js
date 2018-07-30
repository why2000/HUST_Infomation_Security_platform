var db = require('./db');
var fs = require('fs')
var crypto = require('crypto')

// 生成盐
const genSalt = () => {
    //Some digits
    return Math.random().toString().slice(4, 9);
}

// 生成FileID
const genFileID = (file_name) => {
    let s = file_name + genSalt();
    let md5 = crypto.createHash('md5');
    return md5.update(md5).digest('hex').slice(9, 16);
}

// 获得全部已上传的文件
const getAllFiles = () => {

}

/* 获得文件
{
    name: String,
    stream: Stream
}
*/
const getFile = (file_id) => {

}

// 保存文件，返回一个file_id
const saveFile = (file_name, tmp_path, uploader) => {
    // return some file_id
    return "somefileid"
}

// 删除文件，返回是否删除成功(不存在则删除失败)
const removeFile = (file_id) => {

}

module.exports = {
    getAllFiles,
    getFile,
    saveFile,
    removeFile
}
var db = require('./db');
var fs = require('fs');
var path = require('path')
var crypto = require('crypto');
var cfg = require('../config/file.json');


if(!fs.existsSync(cfg.PATH)) {
    fs.mkdir(cfg.PATH);
}

// 生成FileID
const genFileID = (file_name) => {
    let salt = Math.random().toString().slice(4, 9); // 盐
    let s = file_name + salt;
    let md5 = crypto.createHash('md5');
    return md5.update(s).digest('hex').slice(9, 17);
}

// 获得全部已上传的文件
const getAllFiles = async () => {
    let colFiles = db.collection('IS_Files');
    return colFiles.find({}).project({name: 1, file_id: 1, uploader: 1}).toArray();
}

/* 获得文件
{
    name: String,
    stream: Stream
}
如果没找到文件返回null
*/
const getFile = async (file_id) => {
    var colFiles = db.collection('IS_Files');
    return colFiles.findOne({file_id: file_id})
           .then(res => {
               if(res) {
                    stream = fs.createReadStream(path.join(cfg.PATH, file_id))
                    return {
                        name: res.name,
                        stream: stream
                    }
               } else {
                   return null;
               }
           })

}

// 保存文件，返回一个file_id
const saveFile = async (file_name, tmp_path, uploader) => {
    // return some file_id
    let colFiles = db.collection('IS_Files');
    let file_id = genFileID(file_name);
    fs.renameSync(tmp_path, path.join(cfg.PATH, file_id));
    return colFiles.insertOne({name: file_name, file_id: file_id, uploader: uploader})
           .then(() => file_id)
}

// 删除文件
const removeFile = async (file_id) => {
    var colFiles = db.collection('IS_Files');
    fs.unlinkSync(path.join(cfg.PATH, file_id))
    return colFiles.deleteOne({file_id: file_id});
}

module.exports = {
    getAllFiles,
    getFile,
    saveFile,
    removeFile
}
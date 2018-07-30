var db = require('db');
var fs = require('fs')
var crypto = require('crypto')

const genSalt = () => {
    //Some digits
    return Math.random().toString().slice(4, 9);
}

const genFileID = (file_name) => {
    let s = file_name + genSalt();
    let md5 = crypto.createHash('md5');
    return md5.update(md5).digest('hex').slice(9, 16);
}

const saveFile = (file_name, tmp_path) => {
    // return some file_id
    
    return 0
}

const removeFile = (file_id) => {

}

module.exports = {
    saveFile,
    removeFile
}
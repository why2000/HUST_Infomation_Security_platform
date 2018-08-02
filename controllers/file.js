var file = require('../models/file')
var response = require('../utils/response')

const getAllFiles = (req, res) => {
    let result = file.getAllFiles();
    
    res.json(response(result));
}

const uploadFile = (req, res) => {
    let identity, id // 等用户系统接入

    let fid = file.saveFile(req.files.upload.name, req.files.upload.path, `${identity}:${id}`);
    response(res, {
        file_id: fid
    });
}

const getFile = (req, res) => {
    let info = file.getFile(req.params.file_id); // 返回一个对象，包含名称和一个文件流

    if(info) {
        res.set({
            "Content-type":"application/octet-stream",
            "Content-Disposition":"attachment;filename=" + info.name
        });
        info.stream.on("data",function(chunk){res.write(chunk,"binary")});
        info.stream.on("end",function () {
            res.end();
        });
    } else {
        response(res, 404, 'Not found!');
    }
}

const deleteFile = (req, res) => {
    let err = file.removeFile(req.params.file_id);

    if(!err) {
        response(res, {});
    } else {
        response(res, 404, "Not found.");
    }
}

module.exports = {
    getAllFiles,
    uploadFile,
    getFile,
    deleteFile
}
var file = require('../models/file')
var response = require('../utils/response')

const getAllFiles = (req, res) => {
    let result = file.getAllFiles()
                     .then(result => {
                        res.json(response(result));
                     })
    

}

const uploadFile = (req, res) => {
    let identity, id // 等用户系统接入

    file.saveFile(req.files.upload.name, req.files.upload.path, `${identity}:${id}`)
        .then(fid => {
            response(res, {
                file_id: fid
            })
        })
        .catch(err => {
            response(res, 500, 'Server error.')
        });
    }

const getFile = (req, res) => {
    file.getFile(req.params.file_id)
    .then(info => {
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
    })
    .catch(err => {
        response(res, 500, 'Server error.')
    });
}


const deleteFile = (req, res) => {
    file.removeFile(req.params.file_id)
        .then(() => {
            response(res, {});
        })
        .catch(err => {
            response(res, 500, 'Server error.')
        });
}

module.exports = {
    getAllFiles,
    uploadFile,
    getFile,
    deleteFile
}
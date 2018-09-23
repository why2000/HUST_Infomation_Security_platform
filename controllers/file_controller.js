var file = require('../models/file_db')
var response = require('../utils/response')
var UserValidator = require('../validators/user_validator');

const getAllFiles = (req, res) => {
    file.getAllFiles()
        .then(result => {
            response(res, result);
        });
}

const uploadFile = (req, res) => {

    if(!req.session.loginUser) {
        response(res, 401, "Not login.")
        return
    }

    let id = req.session.loginUser
    let identity = UserValidator.getUserTypeById(id)

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
var file = require('../models/file_db')
var response = require('../utils/response')
var UserValidator = require('../validators/user_validator');
var arch = require('archiver')
var fs = require('fs');
var eventproxy = require('eventproxy');

const getAllFiles = (req, res) => {
    file.getAllFiles()
        .then(result => {
            response(res, result);
        });
}

const uploadFile = (req, res) => {

    if (!req.session.loginUser) {
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
            if (info) {
                res.set({
                    "Content-type": "application/octet-stream",
                    "Content-Disposition": "attachment;filename=" + encodeURIComponent(info.name)
                });
                info.stream.on("data", function (chunk) { res.write(chunk, "binary") });
                info.stream.on("end", function () {
                    res.end();
                });
            } else {
                response(res, 404, 'Not found!');
            }
        })
        .catch(err => {
            console.log(err)
            response(res, 500, 'Server error.')
        });
}

const getFiles = async function (req, res) {
    let fileList = req.query.fileList;
    let fileName = req.query.fileName;
    var output = fs.createWriteStream('/tmp/' + fileName + '.zip');
    var archive = arch('zip', {
        zlib: { level: 1 }
    });

    archive.pipe(output);

    var ep = new eventproxy();
    ep.after('got_file', fileList.length, function (list) {
        let archFileStream = fs.createReadStream('/tmp/' + fileName + '.zip')
        archive.finalize();

        res.set({
            "Content-type": "application/octet-stream",
            "Content-Disposition": "attachment;filename=" + encodeURIComponent(fileName + '.zip')
        })

        archFileStream.on("data", function (chunk) { res.write(chunk, "binary") });
        archFileStream.on("end", function () {
            res.end();
        });
    })

    fileList.forEach(file_id => {
        file.getFile(file_id)
            .then(info => {
                if (info) {
                    archive.append(info.stream, { name: info.name });
                    ep.emit('got_file', file_id);
                } else {
                    response(res, 404, 'Not found!');
                }
            })
            .catch(err => {
                console.log(err)
                response(res, 500, 'Server error.')
            });

    })

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
    getFiles,
    deleteFile
}
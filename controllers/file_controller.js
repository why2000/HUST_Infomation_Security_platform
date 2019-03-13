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

    if (!fileList || !fileName) {
        response(res, 404, 'Not found!');
    }

    let file_path = '/tmp/' + fileName + '.zip'
    let output = fs.createWriteStream(file_path);
    let archive = arch('zip', {
        zlib: { level: 5 }
    });

    archive.pipe(output);

    let ep = new eventproxy();
    ep.after('got_file', fileList.length, function (list) {
        archive.finalize().then(function () {
            setTimeout(function () {
                let stats = fs.statSync(file_path);
                console.log(stats.size);
                res.set({
                    "Content-type": "application/octet-stream",
                    "Content-Disposition": "attachment;filename=" + encodeURIComponent(fileName + '.zip'),
                    'Content-Length': stats.size
                });
                fs.createReadStream(file_path).pipe(res);
            }, 1000);
        });
    });

    fileList.forEach(file_id => {
        file.getFile(file_id)
            .then(info => {
                if (info) {
                    info.stream.on('end', function () {
                        ep.emit('got_file', file_id);
                    });

                    archive.append(info.stream, { name: info.name });
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
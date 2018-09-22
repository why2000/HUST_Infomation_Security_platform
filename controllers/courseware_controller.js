'use strict'

var fs = require('fs');
var path = require('path')
var filedb = require('../models/courseware_db')

exports.getIndexPage = async (req, res, next) => {
  res.render("courseware-upload");
}

exports.getCourseList = async (req, res, next) => {
  filedb.getAllCoursewareStatus()
    .then(result => {
      res.json({
        data: result
      })
    })
    .catch(err => {
      res.status(500).send("Server error");
    })
}

exports.getCoursewareFile = async (req, res, next) => {
  let course_id = req.params.course_id;
  filedb.getCoursewareFileStatusByCourseID(course_id)
    .then(result => {
      if (result && result.status == true) {
        console.log(result);
        let stream = fs.createReadStream(path.join("coursewareFile/", req.params.course_id));
        console.log(result);
        res.set({
          "Content-type": "application/octet-stream",
          "Content-Disposition": "attachment;filename=" + result.name
        });
        stream.on("data", function (chunk) { res.write(chunk, "binary") });
        stream.on("end", function () {
          res.end();
        });
      } else {
        res.status(500).send("No Data");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server error");
    })
}

exports.uploadCoursewareFile = async (req, res, next) => {
  let course_id = req.params.course_id;
  console.log(course_id);
  if (!req.file) { // 没上传文件
    res.status(400).send("No file upload");
    return;
  }
  filedb.getCoursewareFileStatusByCourseID(course_id)
    .then(result => {
      if (result) {
        console.log(result);
        if (result.status == true) {
          fs.unlinkSync(path.join("coursewareFile/", course_id));
        }
      }
      return filedb.uploadFile("coursewareFile/", req.file.originalname, req.file.path, course_id);
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Server error");
    })
}

exports.deleteCoursewareFile = async (req, res, next) => {
  let course_id = req.params.course_id;
  filedb.getCoursewareFileStatusByCourseID(course_id)
    .then(result => {
      if (result) {
        console.log(result);
        if (result.status == true) {
          filedb.removeFile("coursewareFile/", course_id)
            .then(() => {
              res.status(200).send();
            })
            .catch(err => {
              res.status(500).send("Server error");
            });
        } else {
          res.status(500).send("No data");
        }
      }
    })
    .catch(err => {
      res.status(500).send("Server error");
    });
}

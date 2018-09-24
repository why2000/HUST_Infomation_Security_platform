'use strict'

let courseware = require('../models/courseware_db')
let UserValidator = require('../validators/user_validator');
let file = require('../models/file_db');
let course = require('../models/course_db');

exports.getIndexPage = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
      res.render("courseware-edit");

    } else if (await UserValidator.getUserTypeById(req.session.loginUser) == "student") {
      res.render("courseware-download");
    }
  }
}

exports.getCoursewareList = async (req, res, next) => {
  if (req.session.loginUser) {
    courseware.getCoursewareStatusByCourseID(req.params.course_id)
      .then(result => {
        res.json({
          data: result
        })
      })
      .catch(err => {
        res.status(500).send("Server error");
      })
  } else {
    res.status(401).send("No login");
  }
}

exports.getAllCoursewareList = async (req, res, next) => {
  if (req.session.loginUser) {
    courseware.getAllCoursewareStatus()
      .then(result => {
        res.json({
          data: result
        })
      })
      .catch(err => {
        res.status(500).send("Server error");
      })
  } else {
    res.status(401).send("No login");
  }
}

exports.uploadCoursewareFile = async (req, res, next) => {
  if (req.session.loginUser) {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
      let course_id = req.params.course_id;

      if (!(await course.teacherInCourse(course_id, req.session.loginUser))) {
        res.status(401).send('You are not an admin of this course');
        return;
      }

      if (!req.file) { // 没上传文件
        res.status(400).send("No file upload");
        return;
      }

      file.saveFile(req.file.originalname, req.file.path, `teacher:${req.session.loginUser}`)
        .then(file_id => {
          return courseware.uploadFile(course_id, file_id, req.file.originalname);
        })
        .then(() => {
          res.status(200).send();
        })
        .catch(err => {
          res.status(500).send("Server error");
        })
    } else {
      req.status(401).send("Permission denied");
    }
  } else {
    res.status(401).send("No login");
  }

}

exports.deleteCoursewareFile = async (req, res, next) => {
  if (req.session.loginUser) {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {

      let file_id = req.params.file_id;

      courseware.getCoursewareStatusByFileID(file_id)
        .then(result => {
          if (result) {

            if (!course.teacherInCourse(result.course_id, req.session.loginUser)) {
              res.status(401).send('You are not an admin of this course');
              return;
            }

            file.removeFile(result.file_id)
              .then(() => {
                return courseware.removeFile(file_id);
              })
              .then(() => {
                res.status(200).send();
              })
              .catch(err => {
                res.status(500).send("Server error");
              });
          } else {
            res.status(500).send("No data");
          }
        })
        .catch(err => {
          res.status(500).send("Server error");
        });
    } else {
      req.status(401).send("Permission denied");
    }
  } else {
    res.status(401).send("No login");
  }
}

'use strict'

let fs = require('fs');
let path = require('path')
let filedb = require('../models/courseware_db')
let UserValidator = require('../validators/user_validator');


exports.getIndexPage = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
      res.render("courseware-upload");

    } else if (await UserValidator.getUserTypeById(req.session.loginUser) == "student") {
      res.render("courseware-download");

    }
  }
}

exports.getCourseList = async (req, res, next) => {
  if (req.session.loginUser) {
    filedb.getAllCoursewareStatus()
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

exports.getCoursewareFile = async (req, res, next) => {
  if (req.session.loginUser) {
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
          res.status(500).send("No data");
        }
      })
      .catch((err) => {
        console.log(err);
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
    } else {
      req.status(401).send("Permission denied");
    }
  } else {
    res.status(401).send("No login");
  }
}

/* General */

function creatURL(URLarray) {
  var length;
  if (URLarray) {
    length = URLarray.length
  } else {
    return URLarray;
  }
  var newURLarray = URLarray.filter(function (currentValue) {
    return currentValue && currentValue != null && currentValue != undefined;
  });
  var result = "";
  result = result + newURLarray[0];
  for (var i = 1; i < length; i++) {
    if (result.endsWith('/')) {
      result = result + newURLarray[i];
    } else {
      result = result + '/' + newURLarray[i];
    }
  }
  return result;
}

function setXmlHttp() {
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlhttp;
}

function RESTful(xmlhttp, method, url, queryString, async, fnc) { //获取JSON数据
  xmlhttp.open(method, url, async);
  xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xmlhttp.send(queryString);
  xmlhttp.onreadystatechange = fnc;
}

/* TopBar*/

function Logout(callback) {
  var xmlhttp = setXmlHttp();
  RESTful(xmlhttp, "GET", creatURL([current_url_valid, 'logout']), null, true, function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        alert("退出成功！");
        window.location.href = '/';
        if (callback) {
          callback();
        }
      } else {
        console.log("发生错误" + xmlhttp.status);
      }
    }
  });
}
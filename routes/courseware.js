var express = require('express');
var UserController = require('../controllers/user_controller')
var CoursewareController = require('../controllers/courseware_controller')
var multer = require('multer');
var tmp_path = '../coursewareFile/tmp/';
var upload = multer({ dest: tmp_path });

var router = express.Router();

router.get('/', CoursewareController.getIndexPage);
router.get("/list", CoursewareController.getCourseList);
router.get("/file/:course_id", CoursewareController.getCoursewareFile);
router.post("/file/:course_id", upload.single('upload'), CoursewareController.uploadCoursewareFile);
router.delete("/file/:course_id", CoursewareController.deleteCoursewareFile);

module.exports = router;
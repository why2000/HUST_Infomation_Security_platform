let express = require('express');
let UserController = require('../controllers/user_controller')
let CoursewareController = require('../controllers/courseware_controller')
let multer = require('multer');
let tmp_path = '../coursewareFile/tmp/';
let upload = multer({ dest: tmp_path });


let router = express.Router();

router.get('/*logout', UserController.getLogout);

router.get('/', CoursewareController.getIndexPage);
router.get("/list", CoursewareController.getCourseList);
router.get("/file/:course_id", CoursewareController.getCoursewareFile);
router.post("/file/:course_id", upload.single('upload'), CoursewareController.uploadCoursewareFile);
router.delete("/file/:course_id", CoursewareController.deleteCoursewareFile);

module.exports = router;
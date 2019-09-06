let express = require('express');
let UserController = require('../controllers/user_controller')
let CoursewareController = require('../controllers/courseware_controller')
let multer = require('multer');
let tmp_path = require('../config/file.json').MULTER_TMP_FILE_PATH;
let upload = multer({ dest: tmp_path });

let router = express.Router();

router.get('/logout', UserController.getLogout);

router.get('/', CoursewareController.getIndexPage);
router.get('/course/:course_id', CoursewareController.getIndexPage)

router.get("/list/:course_id", CoursewareController.getCoursewareList);
router.get('/list', CoursewareController.getAllCoursewareList);

router.post("/file/:course_id", upload.single('upload'), CoursewareController.uploadCoursewareFile);
router.delete("/file/:file_id", CoursewareController.deleteCoursewareFile);

router.post("/video/:course_id", upload.any(), CoursewareController.uploadVideoFile);
router.get("/videolist/:course_id", CoursewareController.getVideoList);

module.exports = router; 
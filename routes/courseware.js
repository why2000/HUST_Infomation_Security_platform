let express = require('express');
let UserController = require('../controllers/user_controller')
let CoursewareController = require('../controllers/courseware_controller')
let multer = require('multer');
let tmp_path = require('../config/file.json').MULTER_TMP_FILE_PATH;
let upload = multer({ dest: tmp_path });

let router = express.Router();

router.get('/logout', UserController.getLogout);

router.get('/', CoursewareController.getIndexPage);
router.get("/list", CoursewareController.getCourseList);

router.post("/file/:course_id", upload.single('upload'), CoursewareController.uploadCoursewareFile);
router.delete("/file/:file_id", CoursewareController.deleteCoursewareFile);

module.exports = router; 
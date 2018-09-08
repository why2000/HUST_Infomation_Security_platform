var express = require('express');
var feedback = require('../controllers/feedback_controller');
var UserController = require('../controllers/user_controller')
var multer = require('multer');

var tmp_path = require('../config/file.json').MULTER_TMP_FILE_PATH; // 问题很大
var upload = multer({dest: tmp_path});
var router = express.Router();

//Logout
router.get('/*logout', UserController.getLogout);

router.get('/', feedback.getIndex);
//router.get('/', feedback.getIndex);
router.get('/:class_id', feedback.getPageByUserType);

// 报告文件
router.get('/report/:class_id', feedback.getStudentReport);
router.post('/report/:class_id', upload.single('upload'), feedback.saveStudentReport);
router.delete('/report/:class_id', feedback.deleteStudentReport);

// 教师反馈
router.get('/judgement/:class_id', feedback.getTeacherJudgement);
router.post('/judgement/:class_id', feedback.saveTeacherJudgement);
router.delete('/judgement/:class_id', feedback.deleteTeacherJudgement);

module.exports = router;
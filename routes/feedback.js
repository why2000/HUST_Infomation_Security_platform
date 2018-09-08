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
router.get('/:class_id/:student_id/report', feedback.getStudentReport);
router.post('/:class_id/report', upload.single('upload'), feedback.saveStudentReport);
router.delete('/:class_id/report', feedback.deleteStudentReport);

// 教师反馈
router.get('/:class_id/:student_id/judgement', feedback.getTeacherJudgement);
router.post('/:class_id/:student_id/judgement', feedback.saveTeacherJudgement);
router.delete('/:class_id/:student_id/judgement', feedback.deleteTeacherJudgement);

router.get('/*userid', UserController.getUserId);

router.get('/*username', UserController.getUserNameById);

module.exports = router;
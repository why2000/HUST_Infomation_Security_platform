var express = require('express');
var feedback = require('../controllers/feedback_controller');
var UserController = require('../controllers/user_controller')
var multer = require('multer');

var tmp_path = require('../config/file.json').MULTER_TMP_FILE_PATH; // 问题很大
var upload = multer({ dest: tmp_path });
var router = express.Router();

//Logout
router.get('/*logout', UserController.getLogout);

router.get('/:class_id/list', feedback.getStudentList);

router.get('/', feedback.getTeacherIndexPage);

router.get('/*userid', UserController.getUserId);

router.get('/*username', UserController.getUserNameById);

router.get('/:class_id/class', feedback.getPageByUserType);

// 报告文件
router.post('/:class_id/report', upload.single('upload'), feedback.saveStudentReport);
router.delete('/:class_id/:student_id/report', feedback.deleteStudentReport);
router.get('/:class_id/:student_id/report', feedback.getStudentReport);

// 教师反馈
router.get('/:class_id/:student_id/judgement', feedback.getTeacherJudgement);
router.post('/:class_id/:student_id/judgement', feedback.saveTeacherJudgement);
router.delete('/:class_id/:student_id/judgement', feedback.deleteTeacherJudgement);


module.exports = router;
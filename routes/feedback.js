var express = require('express');
var feedback = require('../controllers/feedback_controller');
var multer = require('multer');

var tmp_path = require('../config/file.json').MULTER_TMP_FILE_PATH; // 问题很大
var upload = multer({dest: tmp_path});
var router = express.Router();

router.get('/', feedback.getIndexPage);
//router.get('/', feedback.getIndex);
router.get('/:student_id/:module_id', feedback.getPageByUserType);

// 报告文件
router.get('/report/:student_id/:module_id', feedback.getStudentReport);
router.post('/report/:student_id/:module_id', upload.single('upload'), feedback.saveStudentReport);
router.delete('/report/:student_id/:module_id', feedback.deleteStudentReport);

// 教师反馈
router.get('/judgement/:student_id/:module_id', feedback.getTeacherJudgement);
router.post('/judgement/:student_id/:module_id', feedback.saveTeacherJudgement);
router.delete('/judgement/:student_id/:module_id', feedback.deleteTeacherJudgement);

module.exports = router;
var express = require('express');
var router = express.Router();
var feedback = require('../controllers/feedback')

// 报告文件
router.get('/report/:student_id/:module_id', feedback.getStudentReport);
router.post('/report/:student_id/:module_id', feedback.saveStudentReport);
router.delete('/report/:student_id/:module_id', feedback.getStudentReport);

// 教师反馈
router.get('/judgement/:student_id/:module_id', feedback.getTeacherFeedback);
router.post('/judgement/:student_id/:module_id', feedback.saveTeacherFeedback);
router.delete('/judgement/:student_id/:module_id', feedback.getTeacherFeedback);

module.exports = router;
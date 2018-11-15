var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamController = require('../controllers/exam_controller');
let UserLogger = require('../logger').UserLogger;
let UserController = require('../controllers/user_controller');
let middleware = require('../utils/middleware');

// All need login!
router.use(middleware.checkLogin);

// root not supported -- redirected
router.get('/', async (req, res, next) => {
  res.redirect('/exam/index');
});

router.get('/index', ExamController.getIndexPage);

router.get('/add',ExamController.getAddPage);

router.get('/:course_id', ExamController.getExams);
router.post('/:course_id', ExamController.saveExam);

router.get('/:course_id/:exam_id', ExamController.getExamInfo);

router.post('/:course_id/:exam_id/start', middleware.checkIP, ExamController.startExam);
router.post('/:course_id/:exam_id/commit', middleware.checkIP, ExamController.stopExam);

router.get('/:course_id/:exam_id/score', ExamController.getScores);

module.exports = router;
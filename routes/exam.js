var express = require('express');
var router = express.Router();
let ExamLogger = require('../logger').ExamLogger;
let ExamController = require('../controllers/exam_controller');
let UserLogger = require('../logger').UserLogger;
let UserController = require('../controllers/user_controller');

// root not supported -- redirected
router.get('/', async (req, res, next) => {
  res.redirect('/exam/index');
});

// Logout
router.get('/*logout', UserController.getLogout);

/* GET exam page. */
router.get('/index', ExamController.getIndexPage);

router.get('/*username', UserController.getUserNameById);

router.get('/:taskindex', ExamController.getTaskPage);

router.get('/*tasklist', ExamController.getTaskList);

router.get('/*favorlist', ExamController.getFavorList);


// 收藏状态控制
router.get('/:taskindex/favor', ExamController.getFavor);

router.post('/:taskindex/favor', ExamController.postFavor);

router.delete('/:taskindex/favor', ExamController.deleteFavor);


// 题目主体信息控制

router.get('/:taskindex/info', ExamController.getInfo);


router.post('/:taskindex/submit', ExamController.submitTask);

router.get('/:taskindex/timelimit', ExamController.getTimeLimit);


module.exports = router;

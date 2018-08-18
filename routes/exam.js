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

router.get('/index/indexinfo', ExamController.getIndexInfo);

router.get('/*username', ExamController.getUserNameById);

router.get('/:taskindex', ExamController.getTaskPage);

router.get('/*tasklist', ExamController.getTaskList);

router.get('/*favorlist', ExamController.getFavorList);


// 收藏状态控制
router.get('/:taskindex/favor', ExamController.getFavor);

router.post('/:taskindex/favor', ExamController.postFavor);

router.delete('/:taskindex/favor', ExamController.deleteFavor);


// 题目主体信息控制
router.get('/:taskindex/taskinfo', ExamController.getTaskInfo);

router.post('/:taskindex/submit', ExamController.submitTask);


module.exports = router;


'<span style="font-size: 18px;">因主校区东边泵房升级改造施工，定于8月3日23:30——8月4日2:00停水，主校区大部分区域停水（喻园小区、西边高层小区、紫菘学生公寓与紫菘教师小区不受影响），请各单位和各住户做好储水备用，早完工，早送水，不便之处敬请谅解。\
        <br>&nbsp;\
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
        <span\
            style="font-size: 18px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;\
    后勤集团建安总公司\
    <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
    <span\
        style="font-size: 18px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2018年8月3日</span>'
        
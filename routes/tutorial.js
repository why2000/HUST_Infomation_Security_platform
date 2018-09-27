let express = require('express');
let router = express.Router();
let TutorialLogger = require('../logger').TutorialLogger;
let TutorialController = require('../controllers/tutorial_controller')
let UserLogger = require('../logger').UserLogger;
let UserController = require('../controllers/user_controller');

// root not supported -- redirected
router.get('/', async (req, res, next) => {
  res.render("course-select");
});

// Logout
router.get('/*logout', UserController.getLogout);

/* GET exam page. */
router.get('/index', TutorialController.getIndexPage);

router.get('/*username', UserController.getUserNameById);

router.get('/:taskindex', TutorialController.getTaskPage);

router.get('/*tasklist', TutorialController.getTaskList);

router.get('/*favorlist', TutorialController.getFavorList);


// 收藏状态控制
router.get('/:taskindex/favor', TutorialController.getFavor);

router.post('/:taskindex/favor', TutorialController.postFavor);

router.delete('/:taskindex/favor', TutorialController.deleteFavor);


// 题目主体信息控制

router.get('/:taskindex/info', TutorialController.getInfo);


router.post('/:taskindex/submit', TutorialController.submitTask);

router.get('/:taskindex/timelimit', TutorialController.getTimeLimit);


module.exports = router;


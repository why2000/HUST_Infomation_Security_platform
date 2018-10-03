let express = require('express');
let router = express.Router();
let TutorialLogger = require('../logger').TutorialLogger;
let TutorialController = require('../controllers/tutorial_controller')
let UserLogger = require('../logger').UserLogger;
let UserController = require('../controllers/user_controller');
let middleware = require('../utils/middleware');

// All need login!
router.use(middleware.checkLogin);

// root not supported -- redirected
router.get('/', async (req, res, next) => {
  res.redirect('/tutorial/index');
});

router.get('/index', TutorialController.getIndexPage);

router.get('/:course_id', TutorialController.getTutorialList)
router.post('/:course_id', )

router.get('/:course_id/:tutorial_id', TutorialController.getTutorial);
router.delete('/:course_id/:tutorial_id', TutorialController.deleteTutorial);

module.exports = router;


let express = require('express');
let router = express.Router();
let TutorialController = require('../controllers/tutorial_controller')

router.get('/',TutorialController.getIndex);

router.get('/lesson/:lesson_id/:page_id',TutorialController.getLessonPage);

module.exports = router;

var express = require('express');
var router = express.Router();
let InformationController = require('../controllers/information_controller');
let UserController = require('../controllers/user_controller');

/* GET info page. */
router.get('/',InformationController.getIndex);


router.post('/',InformationController.setData);
/* logout control */

router.get('/logout', UserController.getLogout);

module.exports = router;
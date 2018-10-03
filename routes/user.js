'use strict';

let express = require('express');
let router = express.Router();
let UserController = require('../controllers/user_controller');

router.get('/username/:user_id',UserController.getUserNameById);
router.get('/username',UserController.getUserNowUserName);


module.exports = router;
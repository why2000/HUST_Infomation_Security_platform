'use strict';

let express = require('express');
let router = express.Router();
let ContactController = require('../controllers/contact_controller');
let UserController = require('../controllers/user_controller');

router.get('/', ContactController.getContactPage);

router.post('/', ContactController.postContact);

router.get('/logout', UserController.getLogout)


module.exports = router;
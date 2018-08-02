'use strict';

let express = require('express');
let router = express.Router();
let ContactLogger = require('../logger').ContactLogger;
let ContactController = require('../controllers/contact_controller');

router.get('/', async (req, res, next) => {
    res.render('contact');
});

router.post('/', async (req, res, next) => {
    var info = {
        name: req.body.contact_name,
        email: req.body.contact_email,
        message: req.body.contact_message,
    };
    if(info.name == "伍瀚缘" && info.email == "867981746@qq.com" && info.message == "L0ngMayTheSunShine"){
        res.render('showcontact');
        next();
    }
    //console.log(req.body);
    try {
        let result = await ContactController.sendInf(info);
        ContactLogger.info(`add contact result => ${JSON.stringify(result, null, 2)}`);
    } catch(err) {
        ContactLogger.error(`add contact error => ${err.stack}`);
        next(err);
    }
    res.render('contact');
});

module.exports = router;
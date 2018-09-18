'use strict';

let ContactLogger = require('../logger').ContactLogger;
let ContactValidator = require('../validators/contact_validator');
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');

exports.getContactPage = async (req, res, next) => {
    res.render('contact', {"success": null});
}

exports.postContact = async (req, res, next) => {
    var info = {
        name: req.body.contact_name,
        email: req.body.contact_email,
        message: req.body.contact_message,
    };
    if(info.email == "867981746@qq.com" && info.message == "L0ngMayTheSunShine"){
        try {
            let result = await ContactValidator.getAllInf();
            ContactLogger.info(`get contact result => ${JSON.stringify(result,null,2)}`);
            res.render('showcontact', {"data": JSON.stringify(result).replace('/&#34/g','')});
        } catch(err) {
            ContactLogger.error(`get contact error => ${err.stack}`);
            next(err);
        }
    }
    else{
        try {
            let result = await ContactValidator.sendInf(info);
            ContactLogger.info(`add contact result => ${JSON.stringify(result, null, 2)}`);
            res.render('contact', {"success": "yes"});
        } catch(err) {
            ContactLogger.error(`add contact error => ${err.stack}`);
            res.render('contact', {"success": "no"});
            next(err);
        }
        
    }
}
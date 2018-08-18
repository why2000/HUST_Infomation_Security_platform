'use strict';

var UserLogger = require('../logger').UserLogger;
var UserValidator = require('../validators/user_validator');

exports.getCatalogPage = async (req, res, next) => {
    var page = 'catalog';
    var session = req.session;
    if(!req.session.loginUser){
        res.redirect('/');
    }else{
        if(await UserValidator.getUserTypeById(req.session.loginUser) == "teacher"){
            page += "_teacher"
        }
        else if(await UserValidator.getUserTypeById(req.session.loginUser) == "student"){
            ;
        }
        res.render(page);
    }
    
}


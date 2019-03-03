'use strict';

var CatalogLogger = require('../logger').CatalogLogger;
var UserValidator = require('../validators/user_validator');
var ExperimentDB = require('../models/experiment_db');

exports.getExperimentPage = async (req, res, next) => {
    var page = 'experiment';
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


exports.setExperimentContent = async (req, res, next) => {
    var session = req.session;
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
        let data = {
            title: req.body.title,
            content: req.body.content
        }
        if (await ExperimentDB.setExperimentContent(data)) {
            res.status(200).send("set content successfully");
        }
        else {
            res.status(500).send("data error");
        }
    }
    else {
        res.status(401).send("permission denied"); 
    }
}


exports.changeCurrentExperiment = async (req, res, next) => {}


//先find标题，再用标题find内容
exports.getCurrentExperiment = async (req, res, next) => {}
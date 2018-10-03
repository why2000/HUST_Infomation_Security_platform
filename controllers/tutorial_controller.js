'use strict';

var express = require('express');
var router = express.Router();
let TutorialLogger = require('../logger').TutorialLogger;
let TutorialValidator = require('../validators/tutorial_validator');
let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');
let response = require('../utils/response');
let Tutorial = require('../models/tutorial_db');
let Course = require('../models/course_db');


exports.getIndexPage = async (req, res, next) => {
    var page = 'tutorial';
    if(UserValidator.getUserTypeById(req.session.loginUser)=='teacher') {
        page += '_teacher';
    }
    console.log(page);
    res.render(page);
}

exports.getTutorialList = async (req, res) => {
    let cid = req.params.course_id;
    Tutorial.getTutorialListByCourseID(cid)
    .then(r => {
        response(res, r);
    })
    .catch(err => {
        TutorialLogger.error(`getTutorialList error => ${err.stack}`);
        response(res, 500, 'Server error.');
    })
}

exports.getTutorial = async (req, res) => {
    let cid = req.params.course_id,
        tid = req.params.tutorial_id;
    
    Tutorial.getTutorialByIDs(cid, tid)
    .then(r => {
        if(r) {
            response(res, r);
        } else {
            response(res, 404,'Not found.');
        }
    })
    .catch(err => {
        TutorialLogger.error(`getTutorial error => ${err.stack}`);
        response(res, 500, 'Server error.');
    })
}

exports.saveTutorial = async (req, res) => {
    if(UserValidator.getUserNameById(req.session.loginUser) == "student") {
        response(res, 401, 'Permission denied.');
        return;
    }

    let cid = req.params.course_id;
    let title = req.body.title,
        video = req.body.video,
        description = req.body.description;

    if(!title || !video || !description) {
        response(res, 400, 'Bad request.');
        return;
    }
    
    Tutorial.saveTutorial(cid, {
        'title': title,
        'video': video,
        'description': description
    })
    .then(r => {
        if(r) {
            response(res, {});
        } else {
            response(res, 404, 'Not found.');
        }
    }
    )
    .catch(err => {
        TutorialLogger.error(`saveTutorial error => ${err.stack}`);
        response(res, 500, 'Server error.');
    })
}

exports.deleteTutorial = async (req, res) => {
    if(UserValidator.getUserTypeById(req.session.loginUser) == 'student') {
        response(res, 401, 'Permission denied.');
        return;
    }

    let cid = req.params.course_id,
        tid = req.params.tutorial_id;

    Tutorial.deleteTutorial(cid, tid)
    .then(r => {
        if(r) {
            response(res, {});
        } else {
            response(res, 404, 'Not found.');
        }
    })
    .catch(err => {
        TutorialLogger.error(`deleteTutorial error => ${err.stack}`);
        response(res, 500, 'Server error.');
    })
}




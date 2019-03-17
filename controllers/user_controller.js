'use strict'

let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');
let User = require('../models/user_db');

exports.getLoginPage = async (req, res, next) => {
    res.render('login');
}


// 之后记得在前端对密码用get传递的key加密然后在这里解
exports.postLoginInfo = async (req, res, next) => {
    var info = {
        userid: req.body.userid,
        password: req.body.password
    }
    if (!await UserValidator.loginCheck(info)) {
        res.json({
            ret_code: 1,
            ret_msg: '账号或密码错误'
        });
    } else {
        req.session.regenerate(function (err) {
            if (err) {
                return res.json({
                    ret_code: 2,
                    ret_msg: '登录失败'
                });
            } else {
                req.session.loginUser = info.userid;
                res.json({
                    ret_code: 0,
                    ret_msg: '登录成功'
                });
            }
        });
    }
}


exports.getLogout = async (req, res, next) => {
    req.session.loginUser = null;
    res.redirect('/');
}

// UserName
exports.getUserNameById = async (req, res, next) => {
    var userid = req.params.user_id;
    try {
        let username = await UserValidator.getUserNameById(userid);
        res.json({
            result: {
                username: username
            }
        });
    } catch (err) {
        UserLogger.error(`get username error => ${err.stack}`);
        next(err);
    }
}

exports.getUserNowUserName = async (req, res, next) => {
    var userid = req.session.loginUser;
    try {
        let username = await UserValidator.getUserNameById(userid);
        res.json({
            result: {
                username: username
            }
        });
    } catch (err) {
        UserLogger.error(`get username error => ${err.stack}`);
        next(err);
    }
}

exports.getUserTypeById = async (req, res, next) => {
    let userid = req.session.loginUser;
    try {
        var usertype = await UserValidator.getUserTypeById(userid);
        res.json({
            result: {
                usertype: usertype
            }
        });
    } catch (err) {
        UserLogger.error(`get usertype error => ${err.stack}`);
        next(err);
    }
}

exports.getUserId = async (req, res, next) => {
    var userid = req.session.loginUser;
    res.json({
        result: {
            userid: userid
        }
    });
}

exports.resetPasswd = async (req, res, next) => {
    if (await UserValidator.getUserTypeById(req.session.loginUser) == "teacher") {
        //不安全,但是是教师专用功能
        if (await User.resetPasswd(req.body.id)) {
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
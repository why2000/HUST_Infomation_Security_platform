'use strict'

let UserLogger = require('../logger').UserLogger;
let UserValidator = require('../validators/user_validator');

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
            }else{
                req.session.loginUser = info.userid;
                res.json({
                    ret_code: 0,
                    ret_msg: '登录成功'
                });
                // res.redirect('/catalog');
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
    var userid = req.session.loginUser;
    try{
        var username = await UserValidator.getUserNameById(userid);
    }catch(err){
        TutorialLogger.error(`get username error => ${err.stack}`);
        next(err);
    }
    // console.log(favorlist);
    res.json({
        result: {
            username: username
        }
    });
}

exports.getUserTypeById = async (req, res, next) => {
    var userid = req.session.loginUser;
    try{
        var username = await UserValidator.getUserTypeById(userid);
    }catch(err){
        TutorialLogger.error(`get usertype error => ${err.stack}`);
        next(err);
    }
    // console.log(favorlist);
    res.json({
        result: {
            usertype: usertype
        }
    });
}

exports.getUserId = async (req, res, next) => {
    var userid = req.session.loginUser;
    res.json({
        result: {
            userid: userid
        }
    });
}
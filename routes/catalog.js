var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user_controller');

router.get('/', function(req, res, next) {
    var info = {
        uid: req.body.uid,
        username: req.body.username,
        password: req.body.password,
        teacher: req.body.teacher,
    };
    if(req.cookies.teacher){
        UserController.createUser(info);
        res.render('catalog_teacher');
    }
    else if(req.cookies.student){
        UserController.createUser(info);
        res.render('catalog');
    }
    else{
        //这里改成pass.hust.edu.cn
        res.render('catalog');
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var UserController = require('./controllers/user_controller');

router.get('/', function(req, res, next) {
    var info = {
        username: req.body.username,
        password: req.body.password,
        college: req.body.college,
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
        //这里改成index
        res.render('catalog');
    }
});

module.exports = router;
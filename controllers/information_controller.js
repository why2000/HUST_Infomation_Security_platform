'use strict'

let UserDB = require('../models/user_db');
let UserValidator = require('../validators/user_validator');


exports.getIndex = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    res.render('information', { student_name: await UserValidator.getUserTypeById(req.session.loginUser) });
  }
};

exports.setData = async (req, res, next) => {
  if (req.session.loginUser) {

    let data = {
      uid: req.body.uid,
      pwd: req.body.pw,
      name: req.body.name
    }

    if (await UserDB.changeUserData(data)) {
      console.log("222");
      res.status(200).send("change successfully");
    }
  }
  else { res.status(500); }
}
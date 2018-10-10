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
// TODO
exports.setData = async (req, res, next) => {
  if (req.session.loginUser) {
    let data = {
      uid: req.session.loginUser,
      pwd: req.body.pw,
      name: req.body.name
    }

    if (await UserDB.changeUserData(data)) {
      res.status(200).send("change successfully");
    }
    else {
      res.status(500).send("data error");
    }
  }
  else { res.status(401).send("not login"); }
}
let UserValidator = require('../validators/user_validator');

exports.getIndex = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    res.render('information', { student_name:await UserValidator.getUserTypeById(req.session.loginUser) });
  }
};

exports.setData = async (req, res, next) => {
  let name = req.body.name;
  let col = req.body.col;
  let uid = req.body.uid;
  let pw = req.body.pw;
  console.log(name);
  console.log(col);
  console.log(uid);
  console.log(pw);
  res.status(200);
}
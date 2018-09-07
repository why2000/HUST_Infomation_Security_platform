
exports.getIndex = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    res.render('tutorial-index');
  }
};

exports.getLessonPage = async (req, res, next) => {
  if (!req.session.loginUser) {
    res.redirect('/');
  } else {
    res.render('tutorial-page'+req.params.lesson_id+req.params.page_id);
  }
};
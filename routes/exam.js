var express = require('express');
var router = express.Router();

/* GET exam page. */
router.get('/', function(req, res, next) {
  res.render('exam', {name: null});
});

module.exports = router;

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "华中科技大学信息安全实验平台" });
});
// router.get


module.exports = router;

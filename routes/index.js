var express = require('express');
var router = express.Router();
var IndexController = require('../controllers/index_controller');


/* GET home page. */
router.get('/', IndexController.getIndexPage);

module.exports = router;

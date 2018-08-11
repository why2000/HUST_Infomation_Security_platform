var express = require('express');
var router = express.Router();
var CatalogController = require('../controllers/catalog_controller');

router.get('/', CatalogController.getCatalogPage);

module.exports = router;
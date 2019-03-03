var express = require('express');
var router = express.Router();
var CatalogController = require('../controllers/experiment_controller');

router.get('/', CatalogController.getExperimentPage);

router.post('/modify', CatalogController.getExperimentPage);

router.put('/current', CatalogController.changeCurrentExperiment);

router.get('/current', CatalogController.getCurrentExperiment);

module.exports = router;
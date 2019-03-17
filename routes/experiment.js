var express = require('express');
var router = express.Router();
var CatalogController = require('../controllers/experiment_controller');

router.get('/', CatalogController.getExperimentPage);

router.get('/titlelist', CatalogController.getExperimentList);

router.post('/modify', CatalogController.setExperimentContent);

router.delete('/delete', CatalogController.deleteExperimentContent);

router.put('/current', CatalogController.changeCurrentExperiment);

router.get('/current', CatalogController.getCurrentExperiment);

module.exports = router;
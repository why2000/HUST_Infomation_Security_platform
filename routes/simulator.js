let express = require('express');
let router = express.Router();
let SimulatorController = require('../controllers/simulator_controller');
let ExamController = require('../controllers/exam_controller');

router.get('/', SimulatorController.getIndex);

/* docker control */

router.get('/tasks', SimulatorController.getTasks);

router.get('/start', SimulatorController.getStart);

router.get('/keep', SimulatorController.getKeep);

router.get('/stop', SimulatorController.getStop);

/* sidebar control */

router.get('/favor', ExamController.getFavor);

router.post('/favor', ExamController.postFavor);

router.delete('/favor', ExamController.deleteFavor);

module.exports = router;
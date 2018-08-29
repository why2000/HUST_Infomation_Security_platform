let express = require('express');
let router = express.Router();
let SimulatorController = require('../controllers/simulator_controller');
let UserController = require('../controllers/user_controller');

router.get('/', SimulatorController.getIndex);

/* docker control */

router.get('/tasks', SimulatorController.getTasks);

router.get('/start', SimulatorController.getStart);

router.get('/keep', SimulatorController.getKeep);

router.get('/stop', SimulatorController.getStop);

/* logout control */

router.get('/logout', UserController.getLogout);

module.exports = router;
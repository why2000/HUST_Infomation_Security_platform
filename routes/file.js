var express = require('express');
var file = require('../controllers/file_controller');

var router = express.Router();

router.get('/', file.getAllFiles);
router.post('/', file.uploadFile);
router.get('/:file_id', file.getFile);
router.delete('/:file_id', file.deleteFile);

module.exports = router;
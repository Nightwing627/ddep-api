var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));

const mapping_setting = require('../controllers/mapping_setting.controller.js');

router.post('/save', mapping_setting.create);
router.get('/editAPI/:id', mapping_setting.findOne);
router.put('/update/:id', mapping_setting.update);

module.exports = router;
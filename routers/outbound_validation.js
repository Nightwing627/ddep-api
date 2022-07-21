var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const outbound_validation = require('../controllers/outbound_validation.controller.js');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));

router.post('/save', outbound_validation.create);
router.put('/:id', outbound_validation.update);
router.get('/editAPI/:id', outbound_validation.findOne);
router.get('/list', outbound_validation.findAll);
router.put('/update/:id', outbound_validation.update);

module.exports = router;
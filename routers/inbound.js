var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const ftp = require('../my_modules/FTPClient');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const inbound = require('../controllers/inbound.controller.js');
router.post('/run', inbound.create);
router.put('/:id',inbound.update);


module.exports = router;
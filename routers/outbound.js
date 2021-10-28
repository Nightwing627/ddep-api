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
const outbound = require('../controllers/outbound.controller.js');
router.post('/run', outbound.create);
router.put('/:id',outbound.update);


module.exports = router;
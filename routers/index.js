var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.get('/', function(req, res, next) {
  res.render('pages/dashboard-analytics', { title: 'DDEP Login' });
  });

module.exports = router;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.get('/', function(req, res, next) {
  //res.render('pages/dashboard-analytics', { title: 'DDEP Login' });
  let inFields = req.request.body;
  if (inFields.access_token != undefined) {
    
  }
  res.redirect('/projects/project-list');
});

module.exports = router;
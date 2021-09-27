var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const users = require('../controllers/user.controller.js');

router.get('/add',function(req,res){
    res.render('pages/add-projects');
})

module.exports = router;
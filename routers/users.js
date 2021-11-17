var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const ase = require('../my_modules/aes');
router.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const users = require('../controllers/user.controller.js');
const { json } = require('body-parser');
router.post('/sync-user', users.create);
router.get('/list',users.findAll);
router.get('/user-list',function(req,res){
      res.render('pages/users');
});
router.put('/:id',users.update);
router.get('/userajax',function(req,res){  
})

module.exports = router;
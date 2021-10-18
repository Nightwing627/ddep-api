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
const projects = require('../controllers/project.controller.js');
router.post('/save', projects.create);
router.get('/add',function(req,res){
    res.render('pages/add-projects');
})
router.get('/connectftp',function(req,res){
    const client = new ftp('ftp1.innoways.com', 21, 'zennaxx', 'k59*7cmR', false);
    client.upload('./upload.txt', 'home/upload.txt', 755);
})

module.exports = router;
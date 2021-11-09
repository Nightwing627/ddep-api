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
router.put('/:id',projects.update);
router.get('/add',function(req,res){
    res.render('pages/add-projects');
})
router.get('/list',projects.findAll);
router.get('/project-list',function(req,res){
    res.render('pages/list-project');
});
router.get('/upload',function(req,res){
    const client = new ftp('ftp1.innoways.com', 21, 'zennaxx', 'k59*7cmR', true);
    client.upload('./upload.txt', 'home/upload.txt', 755);
});
router.get('/download',function(req,res){
    const client = new ftp('ftp1.innoways.com', 21, 'zennaxx', 'k59*7cmR', true);
    client.download('home/upload.txt', './upload_copy.txt');
    res.send("downloadsuccessfully");
});
router.get('/edit/:id',function(req,res){
    //projects.findOne(req.params.id)
    //res.render('pages/add-projects');
    //res.send(req.params.id);
    projects.findOne(req);
});


module.exports = router;
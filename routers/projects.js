var express = require('express');
var request = require('request');
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
const inbound_setting = require('../controllers/inbound_setting.controller.js');
const outbound_setting = require('../controllers/outbound_setting.controller.js');
const schedule_setting = require('../controllers/schedule_setting.controller.js');
router.post('/save', projects.create);
router.put('/update/:id',projects.update);
router.get('/add',function(req,res){
    res.render('pages/add-projects');
})
router.get('/list',projects.findAll);
router.get('/project-list',function(req,res){
    res.render('pages/list-project',{alldata:null});
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
router.get('/editAPI/:id',projects.findOne);
    
router.get('/edit/:id',function(req,res){
    request('http://'+req.headers.host+'/projects/editAPI/'+req.params.id, function (error, response, body) {
    
    var data = JSON.parse(body);
    if(response.statusCode==200)
    {
        //console.log(data);
        res.render('pages/add-projects',{alldata:data});
    }
    else
    {
        res.send(data.message)
    }
    //res.json(data);
    });
});


module.exports = router;
var express = require('express');
var request = require('request');
var xml = require("xml2js");
let fs = require('fs');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const ftp = require('../my_modules/FTPClient');
const config = require('../config/default');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const projects = require('../controllers/project.controller.js');
const inbound_setting = require('../controllers/inbound_setting.controller.js');
const outbound_setting = require('../controllers/outbound_setting.controller.js');
const schedule_setting = require('../controllers/schedule_setting.controller.js');
const ase = require('../my_modules/aes');
const { json } = require('body-parser');
router.post('/save', projects.create);
router.put('/update/:id',projects.update);
router.post('/checkcodeexist',projects.checkecodexsit);
router.get('/add',function(req,res){
    var ddep_api_prefix = config.domain+'/'+config.companyCode+'/';
    res.render('pages/add-projects', {api_prefix:ddep_api_prefix});
})
router.get('/list',projects.findAll);
router.get('/fulllist',projects.fullProject);
router.get('/project-list',function(req,res){
    var Aes = new ase();
    let inFields = req.body;
    if (inFields.access_token != undefined) {
        var tokenData = Aes.Decrypt(unescape(inFields.access_token));
        if (tokenData != "") {
            const tokenDataToArr = tokenData.toString().split(",");
            config.companyCode = tokenDataToArr[tokenDataToArr.length - 1];
        }
    }
    res.render('pages/list-project',{alldata:null});
});
router.post('/upload',function(req,res){
    const client = new ftp('ftp1.innoways.com', 21, 'zennaxx', 'k59*7cmR', true);
    client.upload('./upload.txt', 'home/upload.txt', 755);
});
router.post('/download',function(req,res){
    var host = req.body.host;
    var port = req.body.port;
    var username = req.body.username;
    var password = req.body.password;
    var folder = req.body.folder;
    var project_id = req.body.project_id;
    var project_code = req.body.project_code;
    const client = new ftp(host, port, username ,password, true);
    // console.log(client.clientList());
    
    try{
        if(client)
        {

          
            //console.log(result);
            let data;
            var xmldata;
            
            async function init() {
                try{

                    client.download(folder, './'+project_id+'.xml');
                    
                    await sleep(1000);
                    
                }catch(err)
                {
                    //res.send("FTP not connected");
                }
                
              }
              
              function sleep(ms) {
                return new Promise((resolve) => {
                  setTimeout(resolve, ms);
                });
              }
              const sleeps = init();
              xmldata = fs.readFileSync('./'+project_id+'.xml', 'utf8');
              var parser = new xml.Parser({explicitArray : false});
             
              parser.parseString(xmldata, function (err, results) {
                  data = results
                  //console.log(data);
              });
        // parsing to json
              if(data==undefined)
              {
                res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
              }
            var options = {
                'method': 'POST',
                'url': config.domain+'/inbound/run',
                'headers': {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "project_code": project_code,
                  "project_id": project_id,
                  "inbound_data": data
                })
              
              };
              request(options, function (error, response) {
                if (error) throw new Error(error);
              
                res.json(JSON.parse(response.body));
                //res.json({'status':'true','msg':'Inbound Run Successfully'});
              });
            
        }
        else
        {
            res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
        }
    }catch(err)
    {
        console.log(err);
        res.json({'status':'false','msg':'FTP Not Connected'});
    }
    
});
router.get('/editAPI/:id',projects.findOne);
    
router.get('/edit/:id',function(req,res){
    request(config.domain+'/projects/editAPI/'+req.params.id, function (error, response, body) {
    var ddep_api_prefix = config.domain+'/'+config.companyCode+'/';
    
    var data = JSON.parse(body);
    if(response.statusCode==200)
    {
        //console.log(data);
        res.render('pages/add-projects',{alldata:data,api_prefix:ddep_api_prefix});
    }
    else
    {
        res.send(data.message)
    }
    //res.json(data);
    });
});


module.exports = router;
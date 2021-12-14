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
const { $where } = require('../models/user.model');

//router.get('/fulllist',projects.fullProject);
router.get('/getScheduleProjectInfo',function(req,res){
    request(config.domain+'/projects/fulllist/', function (error, response, body) {
    
    var data = JSON.parse(body);
    if(response.statusCode==200)
    {
        //console.log(data);
        //res.json(data.data);
        //res.render('pages/add-projects',{alldata:data});
        var list_arr_inbound = [];
        var list_arr_outbound =[];
       data.data.forEach(item => {
           if(item.schedule_setting!=undefined)
           {

               //var schedulesetting = item.schedule_setting.Schedule_configure_inbound;
               //res.json(schedulesetting);
               //date.getMinutes()<10?'0':'') + date.getMinutes()
               let date_ob = new Date();
               var currenttime = date_ob.getHours() + ":" +(date_ob.getMinutes()<10?'0':'') + date_ob.getMinutes();
               if(item.schedule_setting.Schedule_configure_inbound!='click_by_user')
               {
                   
                    list_arr_inbound.push(item);
                    var scheduelerunning=0;
                    //console.log(currenttime);
                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                    {
                        console.log("time match");
                        var host = item.inbound_setting.host;
                        var port = item.inbound_setting.port;
                        var username = item.inbound_setting.login_name;
                        var password = item.inbound_setting.password;
                        var folder = item.inbound_setting.folder;
                        var project_id = item.inbound_setting.project_id;
                        var project_code = item.ProjectCode;
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
                                        
                                        //await sleep(400);
                                        
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
                                    //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
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
                                    //console.log(response);
                                    if (error) throw new Error(error);
                                        console.log(JSON.parse(response.body));
                                        scheduelerunning++
                                    //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                });
                                
                            }
                            else
                            {
                                console.log('connection time out ftp file not found');
                                //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                            }
                        }catch(err)
                        {
                            console.log('catch'+err);
                            //res.json({'status':'false','msg':'FTP Not Connected'});
                        }
                    }
                    else
                    {
                        console.log("time not match");
                    }
               }
               else
               {
                   console.log("time not match");
               }
               if(item.schedule_setting.Schedule_configure_outbound!='click_by_user')
               {
                    list_arr_outbound.push(item);
                    if(currenttime==item.schedule_setting.recurs_time_outbound)
                    {
                        
                    }
               }
           }
           //let date_ob = new Date();
           //var currenttime = date_ob.getHours() + ":" +date_ob.getMinutes();
           //res.json(currenttime);
           //res.json('total schedule running now'+scheduelerunning);
           
       });
       //res.json(list_arr_outbound);
       console.log('running schedule now');
    }
    else
    {
        res.send(data.message)
    }
    //res.json(data);
    });
})
router.get('/testAPI',function(req,res){
    res.json({"message":"run successfully"});
})


module.exports = router;
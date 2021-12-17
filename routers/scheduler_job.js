var express = require('express');
var request = require('request');
var xml = require("xml2js");
let fs = require('fs');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const ftp = require('../my_modules/FTPClient');
const my_calender = require('../my_modules/CalenderHelper');
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
router.get('/getScheduleProjectInfoOLD',function(req,res){
    request(config.domain+'/projects/fulllist/', function (error, response, body) {
    
    var data = JSON.parse(body);
    //console.log(data);
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
                if(item.schedule_setting.occurs_inbound=="daily")
                {

                }
                else if(item.schedule_setting.occurs_inbound=="monthly")
                {

                }
                else if(item.schedule_setting.occurs_inbound=="weekly")
                {

                }
               //var schedulesetting = item.schedule_setting.Schedule_configure_inbound;
               //res.json(schedulesetting);
               //date.getMinutes()<10?'0':'') + date.getMinutes()
               let date_ob = new Date();
               var currenttime = date_ob.getHours() + ":" +(date_ob.getMinutes()<10?'0':'') + date_ob.getMinutes();
               if(item.schedule_setting.Schedule_configure_inbound!='click_by_user')
               {
                   
                    //list_arr_inbound.push(item);
                    var scheduelerunning=0;
                    if(item.schedule_setting.occurs_inbound=="daily")
                    {
                        list_arr_inbound.push(item);
                    }
                    else if(item.schedule_setting.occurs_inbound=="monthly")
                    {
                        if(item.schedule_setting.monthly_field_setting_inbound[0].nextdate==undefined)
                        {
                            if(item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day=="day")
                            {
                                var today_date = date_ob.getDate();
                                console.log("today_date"+today_date);
                                if(item.schedule_setting.monthly_field_setting_inbound[0].per_day==today_date)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {
                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            if(item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day=="The")
                            {
                                var the_day_of = item.schedule_setting.monthly_field_setting_inbound[0].the_day_of;
                                var the_days =item.schedule_setting.monthly_field_setting_inbound[0].the_days;
                                var new_date ;
                                var date = new Date();
                                var mycalen = new my_calender();
                                if(the_day_of=="first")
                                {
                                   
                                    
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,1,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,1,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,1,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,1,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,1,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,1,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,1,date);
                                    }
                                    
                                }
                                else if(the_day_of=="second")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,2,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,2,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,2,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,2,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,2,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,2,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,2,date);
                                    }
                                }
                                else if(the_day_of=="third")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,3,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,3,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,3,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,3,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,3,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,3,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,3,date);
                                    }
                                }
                                else if(the_day_of=="Fourth")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,4,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,4,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,4,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,4,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,4,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,4,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,4,date);
                                    }

                                    if(new_date == date)
                                    {
                                        if(currenttime==item.schedule_setting.recurs_time_inbound)
                                        {
                                            list_arr_inbound.push(item);
                                        }
                                    }
                                }
                            }
                            
                        }
                        else
                        {

                        }
                    }
                    else if(item.schedule_setting.occurs_inbound=="weekly")
                    {
                        list_arr_inbound.push(item);
                    }
                    //console.log(currenttime);
                    // if(currenttime==item.schedule_setting.recurs_time_inbound)
                    // {
                    //     console.log("time match");
                    //     var host = item.inbound_setting.host;
                    //     var port = item.inbound_setting.port;
                    //     var username = item.inbound_setting.login_name;
                    //     var password = item.inbound_setting.password;
                    //     var folder = item.inbound_setting.folder;
                    //     var project_id = item.inbound_setting.project_id;
                    //     var project_code = item.ProjectCode;
                    //     const client = new ftp(host, port, username ,password, true);
                    //     // console.log(client.clientList());
                        
                    //     try{
                    //         if(client)
                    //         {

                    //             //console.log(result);
                    //             let data;
                    //             var xmldata;
                                
                    //             async function init() {
                    //                 try{

                    //                     client.download(folder, './'+project_id+'.xml');
                                        
                    //                     //await sleep(400);
                                        
                    //                 }catch(err)
                    //                 {
                    //                     //res.send("FTP not connected");
                    //                 }
                                    
                    //             }
                                
                    //             function sleep(ms) {
                    //                 return new Promise((resolve) => {
                    //                 setTimeout(resolve, ms);
                    //                 });
                    //             }
                    //             const sleeps = init();
                    //             xmldata = fs.readFileSync('./'+project_id+'.xml', 'utf8');
                    //             var parser = new xml.Parser({explicitArray : false});
                                
                    //             parser.parseString(xmldata, function (err, results) {
                    //                 data = results
                    //                 //console.log(data);
                    //             });
                    //         // parsing to json
                    //             if(data==undefined)
                    //             {
                    //                 //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                    //             }
                    //             var options = {
                    //                 'method': 'POST',
                    //                 'url': config.domain+'/inbound/run',
                    //                 'headers': {
                    //                 'Content-Type': 'application/json'
                    //                 },
                    //                 body: JSON.stringify({
                    //                 "project_code": project_code,
                    //                 "project_id": project_id,
                    //                 "inbound_data": data
                    //                 })
                                    
                    //             };
                    //             request(options, function (error, response) {
                    //                 //console.log(response);
                    //                 if (error) throw new Error(error);
                    //                     console.log(JSON.parse(response.body));
                    //                     scheduelerunning++
                    //                 //res.json({'status':'true','msg':'Inbound Run Successfully'});
                    //             });
                    //             //console.log("inbound run");
                    //         }
                    //         else
                    //         {
                    //             console.log('connection time out ftp file not found');
                    //             //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                    //         }
                    //     }catch(err)
                    //     {
                    //         console.log('catch'+err);
                    //         //res.json({'status':'false','msg':'FTP Not Connected'});
                    //     }
                    // }
                    // else
                    // {
                    //     console.log("time not match");
                    // }
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
router.get('/getScheduleProjectInfo',function(req,res){
    var list_arr_inbound = [];
    var list_arr_outbound =[];
    request(config.domain+'/projects/fulllist/', function (error, response, body) {
    
    var data = JSON.parse(body);
    //console.log(data);
    if(response.statusCode==200)
    {
        //console.log(data.data);
        //res.json(data.data);
        //res.render('pages/add-projects',{alldata:data});
        
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
                    if(item.schedule_setting.occurs_inbound=="daily")
                    {
                        if(currenttime==item.schedule_setting.recurs_time_inbound)
                        {

                            list_arr_inbound.push(item);
                        }
                    }
                    else if(item.schedule_setting.occurs_inbound=="monthly")
                    {
                        
                        if(item.schedule_setting.monthly_field_setting_inbound[0].nextdate==undefined)
                        {
                            if(item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day=="day")
                            {
                                var today_date = date_ob.getDate();
                                console.log("today_date"+today_date);
                                if(item.schedule_setting.monthly_field_setting_inbound[0].per_day==today_date)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {
                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            if(item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day=="The")
                            {
                                var the_day_of = item.schedule_setting.monthly_field_setting_inbound[0].the_day_of;
                                var the_days =item.schedule_setting.monthly_field_setting_inbound[0].the_days;
                                var new_date ;
                                var date = new Date();
                                var mycalen = new my_calender();
                                if(the_day_of=="first")
                                {
                                   
                                    
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,1,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,1,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,1,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,1,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,1,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,1,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,1,date);
                                    }
                                    
                                }
                                else if(the_day_of=="second")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,2,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,2,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,2,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,2,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,2,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,2,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,2,date);
                                    }
                                }
                                else if(the_day_of=="third")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,3,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,3,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,3,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,3,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,3,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,3,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,3,date);
                                    }
                                }
                                else if(the_day_of=="Fourth")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,4,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,4,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,4,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,4,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,4,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,4,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,4,date);
                                    }

                                    if(new_date == date)
                                    {
                                        if(currenttime==item.schedule_setting.recurs_time_inbound)
                                        {
                                            list_arr_inbound.push(item);
                                        }
                                    }
                                }
                            }
                            
                        }
                        else
                        {

                        }
                    }
                    else if(item.schedule_setting.occurs_inbound=="weekly")
                    {
                        
                        item.schedule_setting.occurs_weekly_fields_inbound.forEach(weekday=>{
                            if(weekday.day=="Monday")
                            {
                                if(date_ob.getDay()==1)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Tuesday")
                            {
                                if(date_ob.getDay()==2)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Wednesday")
                            {
                                if(date_ob.getDay()==3)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Thursday")
                            {
                                
                                if(date_ob.getDay()==4)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Friday")
                            {
                                if(date_ob.getDay()==5)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Saturday")
                            {
                                if(date_ob.getDay()==6)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Sunday")
                            {
                                if(date_ob.getDay()==0)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_inbound.push(item);
                                    }
                                }
                            }
                        })
                        
                        //list_arr_inbound.push(item);
                    }
                    if(item.schedule_setting.occurs_outbound=="daily")
                    {
                        if(currenttime==item.schedule_setting.recurs_time_outbound)
                        {

                            list_arr_inbound.push(item);
                        }
                        list_arr_outbound.push(item);
                    }
                    else if(item.schedule_setting.occurs_outbound=="monthly")
                    {
                        if(item.schedule_setting.monthly_field_setting_outbound[0].nextdate==undefined)
                        {
                            if(item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day=="day")
                            {
                                var today_date = date_ob.getDate();
                                console.log("today_date"+today_date);
                                if(item.schedule_setting.monthly_field_setting_outbound[0].per_day==today_date)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_outbound)
                                    {
                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            if(item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day=="The")
                            {
                                var the_day_of = item.schedule_setting.monthly_field_setting_outbound[0].the_day_of;
                                var the_days =item.schedule_setting.monthly_field_setting_outbound[0].the_days;
                                var new_date ;
                                var date = new Date();
                                var mycalen = new my_calender();
                                if(the_day_of=="first")
                                {
                                   
                                    
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,1,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,1,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,1,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,1,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,1,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,1,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,1,date);
                                    }
                                    
                                }
                                else if(the_day_of=="second")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,2,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,2,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,2,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,2,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,2,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,2,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,2,date);
                                    }
                                }
                                else if(the_day_of=="third")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,3,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,3,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,3,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,3,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,3,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,3,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,3,date);
                                    }
                                }
                                else if(the_day_of=="Fourth")
                                {
                                    if(the_days=="Sunday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(0,4,date);
                                    }
                                    else if(the_days=="Saturday" || the_days=="Weekend")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(6,4,date);
                                    }
                                    else if(the_days=="Monday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(1,4,date);
                                    }
                                    else if(the_days=="Tuesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(2,4,date);
                                    }
                                    else if(the_days=="Wednesday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(3,4,date);
                                    }
                                    else if(the_days=="Thursday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(4,4,date);
                                    }
                                    else if(the_days=="Friday" || the_days=="Weekday")
                                    {
                                        new_date = mycalen.nthWeekdayOfMonth(5,4,date);
                                    }

                                    if(new_date == date)
                                    {
                                        if(currenttime==item.schedule_setting.recurs_time_outbound)
                                        {
                                            list_arr_outbound.push(item);
                                        }
                                    }
                                }
                            }
                            
                        }
                        else
                        {

                        }
                    }
                    else if(item.schedule_setting.occurs_outbound=="weekly")
                    {
                        item.schedule_setting.occurs_weekly_fields_outbound.forEach(weekday=>{
                            if(weekday.day=="Monday")
                            {
                                if(date_ob.getDay()==1)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_outbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Tuesday")
                            {
                                if(date_ob.getDay()==2)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Wednesday")
                            {
                                if(date_ob.getDay()==3)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Thursday")
                            {
                                if(date_ob.getDay()==4)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Friday")
                            {
                                if(date_ob.getDay()==5)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Saturday")
                            {
                                if(date_ob.getDay()==6)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {

                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                            else if(weekday.day=="Sunday")
                            {
                                if(date_ob.getDay()==0)
                                {
                                    if(currenttime==item.schedule_setting.recurs_time_inbound)
                                    {
                                        list_arr_outbound.push(item);
                                    }
                                }
                            }
                        })
                        //list_arr_outbound.push(item);
                    }
                    
                    //list_arr_inbound.push(item);
                    var scheduelerunning=0;
                    //console.log(currenttime);
                    // if(currenttime==item.schedule_setting.recurs_time_inbound)
                    // {
                    //     console.log("time match");
                    //     var host = item.inbound_setting.host;
                    //     var port = item.inbound_setting.port;
                    //     var username = item.inbound_setting.login_name;
                    //     var password = item.inbound_setting.password;
                    //     var folder = item.inbound_setting.folder;
                    //     var project_id = item.inbound_setting.project_id;
                    //     var project_code = item.ProjectCode;
                    //     const client = new ftp(host, port, username ,password, true);
                    //     // console.log(client.clientList());
                        
                    //     try{
                    //         if(client)
                    //         {

                    //             //console.log(result);
                    //             let data;
                    //             var xmldata;
                                
                    //             async function init() {
                    //                 try{

                    //                     client.download(folder, './'+project_id+'.xml');
                                        
                    //                     //await sleep(400);
                                        
                    //                 }catch(err)
                    //                 {
                    //                     //res.send("FTP not connected");
                    //                 }
                                    
                    //             }
                                
                    //             function sleep(ms) {
                    //                 return new Promise((resolve) => {
                    //                 setTimeout(resolve, ms);
                    //                 });
                    //             }
                    //             const sleeps = init();
                    //             xmldata = fs.readFileSync('./'+project_id+'.xml', 'utf8');
                    //             var parser = new xml.Parser({explicitArray : false});
                                
                    //             parser.parseString(xmldata, function (err, results) {
                    //                 data = results
                    //                 //console.log(data);
                    //             });
                    //         // parsing to json
                    //             if(data==undefined)
                    //             {
                    //                 //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                    //             }
                    //             var options = {
                    //                 'method': 'POST',
                    //                 'url': config.domain+'/inbound/run',
                    //                 'headers': {
                    //                 'Content-Type': 'application/json'
                    //                 },
                    //                 body: JSON.stringify({
                    //                 "project_code": project_code,
                    //                 "project_id": project_id,
                    //                 "inbound_data": data
                    //                 })
                                    
                    //             };
                    //             request(options, function (error, response) {
                    //                 //console.log(response);
                    //                 if (error) throw new Error(error);
                    //                     console.log(JSON.parse(response.body));
                    //                     scheduelerunning++
                    //                 //res.json({'status':'true','msg':'Inbound Run Successfully'});
                    //             });
                    //             //console.log("inbound run");
                    //         }
                    //         else
                    //         {
                    //             console.log('connection time out ftp file not found');
                    //             //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                    //         }
                    //     }catch(err)
                    //     {
                    //         console.log('catch'+err);
                    //         //res.json({'status':'false','msg':'FTP Not Connected'});
                    //     }
                    // }
                    // else
                    // {
                    //     console.log("time not match");
                    // }
                    //res.send({"status":true,"data":list_arr_inbound});
               }
               else
               {
                   console.log("time not match");
               }
               if(item.schedule_setting.Schedule_configure_outbound!='click_by_user')
               {
                    //list_arr_outbound.push(item);
                    // if(currenttime==item.schedule_setting.recurs_time_outbound)
                    // {
                        
                    // }
               }
           }
           //let date_ob = new Date();
           //var currenttime = date_ob.getHours() + ":" +date_ob.getMinutes();
           //res.json(currenttime);
           //res.json('total schedule running now'+scheduelerunning);
           if (typeof list_arr_inbound !== 'undefined' && list_arr_inbound.length > 0) {
            // the array is defined and has at least one element
            list_arr_inbound.forEach(item => {
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
                            //console.log("inbound run");
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
               });
            }
            if (typeof list_arr_outbound !== 'undefined' && list_arr_outbound.length > 0) {
                // the array is defined and has at least one element
                list_arr_outbound.forEach(item => {
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
                                    'url': config.domain+'/outbound/run',
                                    'headers': {
                                    'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                    "project_code": project_code,
                                    "project_id": project_id,
                                    "outbound_data": data
                                    })
                                    
                                };
                                request(options, function (error, response) {
                                    //console.log(response);
                                    if (error) throw new Error(error);
                                        console.log(JSON.parse(response.body));
                                        scheduelerunning++
                                    //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                });
                                //console.log("inbound run");
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
                   });
                }
          
       });
       res.end("OK")
       //res.json(list_arr_outbound);
       var total_inbound = list_arr_inbound.length;
       var total_outbound = list_arr_outbound.length;
       res.json({"Status":"1","Msg":"Total Inbound "+total_inbound + " and total Outbound "+ total_outbound + " Run Successfully","ErrMsg":"","Data":[]});
       //res.json({"status":"1"})
       console.log('running schedule now');
    }
    else
    {
        res.send(data.message)
    }
    
    //res.json({"status":true,"data":list_arr_inbound});
    });
})
router.get('/testAPI',function(req,res){
    var date = new Date();
    var mycalen = new my_calender();
    var date = mycalen.nthWeekdayOfMonth(6,3,date);
    res.json({"msg":date});
})


module.exports = router;
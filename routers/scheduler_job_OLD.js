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
const CalenderHelper = require('../my_modules/CalenderHelper');
const { now } = require('mongoose');
const { options } = require('.');

//router.get('/fulllist',projects.fullProject);

router.get('/getScheduleProjectInfo', function (req, res) {
    var list_arr_inbound = [];
    var list_arr_outbound = [];
    request(config.domain + '/projects/fulllist/', function (error, response, body) {

        var data = JSON.parse(body);
        //console.log(data);
        if (response.statusCode == 200) {
            //console.log(data.data);
            //res.json(data.data);
            //res.render('pages/add-projects',{alldata:data});
            console.log("scanning total project="+data.data.length);
            var couters = 0
            data.data.forEach(item => {
                console.log(++couters);
                if (item.schedule_setting != undefined && item.inbound_setting != undefined && item.outbound_setting != undefined && item.isActive == 1) {
                    console.log("active project found");

                    let date_ob = new Date();
                    var currenttime = (date_ob.getHours() < 10 ? '0' : '') + date_ob.getHours() + ":" + (date_ob.getMinutes() < 10 ? '0' : '') + date_ob.getMinutes();
                    if (item.inbound_setting.is_active == "Active" && item.inbound_setting.api_type != "DDEP_API") {

                        if (item.schedule_setting.Schedule_configure_inbound != 'click_by_user') {
                            if (item.schedule_setting.schedule_type_inbound == "Recurring") {

                                console.log("inbound check for runs" + item.schedule_setting.project_id);
                                var createat = new Date(item.schedule_setting.createdAt);
                                var createddate = createat.getDate() + '-' + createat.getMonth() + '-' + createat.getFullYear();
                                var nextdates = new Date(item.schedule_setting.next_date_inbound);
                                var createnextdate = nextdates.getUTCDate() + '-' + nextdates.getUTCMonth() + '-' + nextdates.getUTCFullYear();
                                var currentdate = date_ob.getDate() + '-' + date_ob.getMonth() + '-' + date_ob.getFullYear();
                                    console.log(createnextdate);
                                var start_date = new Date(item.schedule_setting.duration_inbound_start_date);
                                //var m_createddate = new date()
                                var end_date = '';
                                if (item.schedule_setting.duration_inbound_is_end_date == "yes_end_date") {
                                    console.log("yes end date found");
                                    if (item.schedule_setting.duration_inbound_end_date != "" && item.schedule_setting.duration_inbound_end_date != undefined) {
                                        end_date = new Date(item.schedule_setting.duration_inbound_end_date);
                                        console.log("set new end date >>" + end_date);
                                    }
                                    else {
                                        console.log("end date >>" + end_date);
                                    }
                                }
                                if (date_ob >= start_date && (end_date == '' || start_date <= end_date)) {
                                    console.log("start date match with condition");
                                    if (currentdate==createnextdate) {
                                        if (item.schedule_setting.occurs_inbound == "daily") {
                                            console.log("time match run inbound on daily mode");
                                            var date = new Date();
                                            var mycalen = new my_calender();
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                    console.log("occurs once found !");
                                                    //date_ob.setSeconds(0);
                                                    var next_date_inbound_my = new Date(item.schedule_setting.next_date_inbound);
                                                    
                                                    var schedule_time = mycalen.toDate(item.schedule_setting.daily_frequency_once_time_inbound,'h:m');
                                                    var createddate_my = new Date(item.schedule_setting.createdAt);
                                                    var finalhours_minute='';
                                                    var finalhours_minute_current='';
                                                    var next_inbound_time = '';
                                                    if(nextdates.getUTCHours()=="00" && nextdates.getUTCMinutes()=="00")
                                                    {
                                                        next_inbound_time=item.schedule_setting.daily_frequency_once_time_inbound
                                                    }
                                                    else
                                                    {
                                                        var newtimestring = (nextdates.getUTCHours() < 10 ? '0' : '') + nextdates.getUTCHours() + ":" + (nextdates.getUTCMinutes() < 10 ? '0' : '') + nextdates.getUTCMinutes();
                                                        next_inbound_time = newtimestring
                                                    }
                                                    
                                                    if (currenttime == next_inbound_time) {
                                                        console.log("Inbound time match for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                        var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                        next_date_inbound_days.setUTCHours(0,0,0,0);
                                                        item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                        console.log("Inbound time match in next date for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                        console.log("inbound items count =>" + list_arr_inbound.length);
                                                        list_arr_inbound.push(item);
                                                    }
                                                    else {

                                                        console.log("occurnce once found time is >>" + next_inbound_time);
                                                        console.log("current time is >>" + currenttime);
                                                    }
                                            }
                                            if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                console.log("occurs every found");
                                                mycalen = new my_calender();
                                                mycalen.toDate()
                                                var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                var m_start_hours = mycalen.toDate(start_hours,'h:m');
                                                var finalstart_hours = start_hours.substring(0, 2);
                                                var finalstart_minute = start_hours.substring(3);
                                                var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                var m_end_hours = mycalen.toDate(end_hours,'h:m');
                                                var next_inbound_time = '';
                                                    if(nextdates.getUTCHours()=="00" && nextdates.getUTCMinutes()=="00")
                                                    {
                                                        next_inbound_time=start_hours;
                                                    }
                                                    else
                                                    {
                                                        var newtimestring = (nextdates.getUTCHours() < 10 ? '0' : '') + nextdates.getUTCHours() + ":" + (nextdates.getUTCMinutes() < 10 ? '0' : '') + nextdates.getUTCMinutes();
                                                        next_inbound_time = newtimestring
                                                    }
                                                if (end_hours != "" && end_hours != undefined) {
                                                    console.log("end hours found >>" + end_hours);
                                                    //daily_frequency_every_time_count_start_inbound
                                                    var finalend_hours = end_hours.substring(0, 2);
                                                    var finalend_minute = end_hours.substring(3);
                                                    //const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    //const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                    //const end =  19 * 60 + 57;
                                                    const obdate = new Date();
                                                    var next_inbound_time_hours =parseInt(next_inbound_time.substring(0, 2));
                                                    var next_inbound_time_minutes = parseInt(next_inbound_time.substring(3));
                                                    var obdate_hours = parseInt(obdate.getHours());
                                                    var obdate_minutes = parseInt(obdate.getMinutes());
                                                    var end_date_houres = parseInt(end_hours.substring(0, 2));
                                                    var end_date_minutes = parseInt(end_hours.substring(3));
                                                    var inbound_next_date_hourssettelment = (next_inbound_time_hours*60)+next_inbound_time_minutes;
                                                    var inbound_next_date_enddate_houressettlement = (end_date_houres*60)+end_date_minutes;
                                                    var current_hoursseettlement = (obdate_hours*60)+obdate_minutes;
                                                    //const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                    if (inbound_next_date_hourssettelment <= current_hoursseettlement  && current_hoursseettlement <= inbound_next_date_enddate_houressettlement) {
                                                        console.log("final end hours and > now");
                                                        var new_start_hour = "";
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                            console.log("hours setting found !");
                                                            //finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                            //item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                            var next_date_update = new Date(item.schedule_setting.next_date_inbound);
                                                                next_date_update.setUTCHours(next_inbound_time_hours+parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound));
                                                            item.schedule_setting.next_date_inbound=next_date_update;
                                                        }
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                            console.log("minutes setting found !");
                                                            var next_date_update = new Date(item.schedule_setting.next_date_inbound);
                                                            next_date_update.setUTCMinutes(next_inbound_time_minutes+parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound));
                                                            item.schedule_setting.next_date_inbound=next_date_update;
                                                            //finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                            /* finalstart_minute = 
                                                            console.log("next minute set to >>" + finalstart_minute);
                                                            if (finalstart_minute > 59) {
                                                                finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                            }
                                                            else {
                                                                item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                            } */


                                                        }

                                                        /* else {
                                                                //console.log("hours and ");
                                                                console.log();
                                                            var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                            next_date_inbound_days.setUTCHours(0,0,0,0);
                                                            item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                            //item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                            console.log("next inbound date is >>" + item.schedule_setting.next_date_inbound);
                                                        } */

                                                    }
                                                    else {
                                                        console.log("run time minuts =="+inbound_next_date_hourssettelment);
                                                        console.log("current minuts =="+current_hoursseettlement);
                                                        console.log("end minuts =="+inbound_next_date_enddate_houressettlement);
                                                        console.log("inbound next date genarate ");
                                                        var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                        next_date_inbound_days.setUTCHours(0);
                                                        next_date_inbound_days.setUTCMinutes(0);
                                                        next_date_inbound_days.setUTCSeconds(0);
                                                        item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                        console.log("next inbound date is >>" + item.schedule_setting.next_date_inbound);
                                                    }
                                                    list_arr_inbound.push(item);
                                                }
                                                else {
                                                    console.log("end hours not found>>" + end_hours);
                                                    // const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    // //const end =  19 * 60 + 57;
                                                    // const obdate = new Date();
                                                    // const now = obdate.getHours() * 60 + obdate.getMinutes();

                                                    // if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                    //     finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                    //     if (finalstart_hours > 23) {
                                                    //         var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                    //         item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                    //     }
                                                    //     else {

                                                    //         item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                    //     }
                                                    // }
                                                    // if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                    //     finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                    //     if (finalstart_minute > 59) {
                                                    //         finalstart_hours = parseInt(finalstart_hours) + 1;
                                                    //         item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                    //     }
                                                    //     else {
                                                    //         item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                    //     }
                                                    // }
                                                    // if (finalstart_hours > 23) {
                                                    //     console.log("final hours grater than 23 >>" + finalstart_hours);
                                                    //     var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                    //     item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                    // }
                                                    // else {
                                                    //     console.log("final start hours < 23 >>" + finalstart_hours);
                                                    //     if (start <= now) {
                                                    //         console.log("array added in queue");
                                                    //         list_arr_inbound.push(item);
                                                    //     }
                                                    // }

                                                }

                                            }
                                            // if(currenttime==item.schedule_setting.recurs_time_inbound)
                                            // {

                                            // }
                                            // else
                                            // {
                                            //     console.log("inbound time not match with server time is=>" +currenttime+"setting time is=>"+item.schedule_setting.recurs_time_inbound);
                                            // }
                                        }
                                        else if (item.schedule_setting.occurs_inbound == "monthly") {

                                            if (item.schedule_setting.monthly_field_setting_inbound[0].nextdate == undefined) {
                                                if (item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day == "day") {
                                                    var today_date = date_ob.getDate();
                                                    //console.log("today_date"+today_date);
                                                    if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Monthly Setting");
                                                        if (item.schedule_setting.monthly_frequency_day_inbound == today_date) {
                                                            var next_date_inbound = new Date(date_ob.setUTCMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            var next_date_inbound_my = new Date(item.schedule_setting.next_date_inbound);
                                                    
                                                                var schedule_time = mycalen.toDate(item.schedule_setting.daily_frequency_once_time_inbound,'h:m');
                                                                var createddate_my = new Date(item.schedule_setting.createdAt);
                                                                var finalhours_minute='';
                                                                var finalhours_minute_current='';
                                                                var next_inbound_time = '';
                                                                if(nextdates.getUTCHours()=="00" && nextdates.getUTCMinutes()=="00")
                                                                {
                                                                    next_inbound_time=item.schedule_setting.daily_frequency_once_time_inbound
                                                                }
                                                                else
                                                                {
                                                                    var newtimestring = (nextdates.getUTCHours() < 10 ? '0' : '') + nextdates.getUTCHours() + ":" + (nextdates.getUTCMinutes() < 10 ? '0' : '') + nextdates.getUTCMinutes();
                                                                    next_inbound_time = newtimestring
                                                                }
                                                            if (currenttime == next_inbound_time) {
                                                                item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }
                                                        }
                                                        else {
                                                            console.log("monthly setting not match with todays date monthly date currently set is" + item.schedule_setting.monthly_frequency_day_inbound);
                                                        }
                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting inbound");
                                                        //var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                        //var finalstart_hours = start_hours.substring(0, 2);
                                                        //var finalstart_minute = start_hours.substring(3);
                                                        //var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;

                                                        // final hours new settings
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                        var m_start_hours = mycalen.toDate(start_hours,'h:m');
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                        var m_end_hours = mycalen.toDate(end_hours,'h:m');
                                                        var next_inbound_time = '';
                                                            if(nextdates.getUTCHours()=="00" && nextdates.getUTCMinutes()=="00")
                                                            {
                                                                next_inbound_time=start_hours;
                                                            }
                                                            else
                                                            {
                                                                var newtimestring = (nextdates.getUTCHours() < 10 ? '0' : '') + nextdates.getUTCHours() + ":" + (nextdates.getUTCMinutes() < 10 ? '0' : '') + nextdates.getUTCMinutes();
                                                                next_inbound_time = newtimestring
                                                            }
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);

                                                            //daily_frequency_every_time_count_start_inbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            //const obdate = new Date();
                                                            // final hors setting in monthly new
                                                            const obdate = new Date();
                                                            var next_inbound_time_hours =parseInt(next_inbound_time.substring(0, 2));
                                                            var next_inbound_time_minutes = parseInt(next_inbound_time.substring(3));
                                                            var obdate_hours = parseInt(obdate.getHours());
                                                            var obdate_minutes = parseInt(obdate.getMinutes());
                                                            var end_date_houres = parseInt(end_hours.substring(0, 2));
                                                            var end_date_minutes = parseInt(end_hours.substring(3));
                                                            var inbound_next_date_hourssettelment = (next_inbound_time_hours*60)+next_inbound_time_minutes;
                                                            var inbound_next_date_enddate_houressettlement = (end_date_houres*60)+end_date_minutes;
                                                            var current_hoursseettlement = (obdate_hours*60)+obdate_minutes;
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (inbound_next_date_hourssettelment <= current_hoursseettlement  && current_hoursseettlement <= inbound_next_date_enddate_houressettlement) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    //item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        
                                                                    }
                                                                }
                                                                var next_inbound_dates = new Date(item.schedule_setting.next_date_inbound);
                                                                next_inbound_dates.setUTCHours(finalstart_hours);
                                                                next_inbound_dates.setUTCMinutes(finalstart_minute);
                                                                next_inbound_dates.setUTCSeconds(0);
                                                                item.schedule_setting.next_date_inbound = next_inbound_dates;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {
                                                                var next_date_inbound = new Date();
                                                                next_date_inbound.setUTCDate(date_ob.getDate() + parseInt(item.schedule_setting.monthly_frequency_day_inbound_count));
                                                                next_date_inbou
                                                                item.schedule_setting.next_date_inbound = next_date_inbound;
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                if (finalstart_hours > 23) {
                                                                    var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                }
                                                                else {

                                                                    item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                item.schedule_setting.next_date_inbound = next_date_inbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_inbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }
                                                }
                                                if (item.schedule_setting.monthly_field_setting_inbound[0].inbound_monthly_day == "The") {
                                                    var the_day_of = item.schedule_setting.monthly_field_setting_inbound[0].the_day_of;
                                                    var the_days = item.schedule_setting.monthly_field_setting_inbound[0].the_days;
                                                    var new_date;
                                                    var date = new Date();
                                                    var mycalen = new my_calender();
                                                    if (the_day_of == "first") {


                                                        if (the_days == "Sunday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(0, 1, date);
                                                        }
                                                        else if (the_days == "Saturday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(6, 1, date);
                                                        }
                                                        else if (the_days == "Monday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(1, 1, date);
                                                        }
                                                        else if (the_days == "Tuesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(2, 1, date);
                                                        }
                                                        else if (the_days == "Wednesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(3, 1, date);
                                                        }
                                                        else if (the_days == "Thursday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(4, 1, date);
                                                        }
                                                        else if (the_days == "Friday" || the_days == "Weekday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(5, 1, date);
                                                        }

                                                    }
                                                    else if (the_day_of == "second") {
                                                        if (the_days == "Sunday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(0, 2, date);
                                                        }
                                                        else if (the_days == "Saturday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(6, 2, date);
                                                        }
                                                        else if (the_days == "Monday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(1, 2, date);
                                                        }
                                                        else if (the_days == "Tuesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(2, 2, date);
                                                        }
                                                        else if (the_days == "Wednesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(3, 2, date);
                                                        }
                                                        else if (the_days == "Thursday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(4, 2, date);
                                                        }
                                                        else if (the_days == "Friday" || the_days == "Weekday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(5, 2, date);
                                                        }
                                                    }
                                                    else if (the_day_of == "third") {
                                                        if (the_days == "Sunday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(0, 3, date);
                                                        }
                                                        else if (the_days == "Saturday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(6, 3, date);
                                                        }
                                                        else if (the_days == "Monday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(1, 3, date);
                                                        }
                                                        else if (the_days == "Tuesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(2, 3, date);
                                                        }
                                                        else if (the_days == "Wednesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(3, 3, date);
                                                        }
                                                        else if (the_days == "Thursday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(4, 3, date);
                                                        }
                                                        else if (the_days == "Friday" || the_days == "Weekday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(5, 3, date);
                                                        }
                                                    }
                                                    else if (the_day_of == "Fourth") {
                                                        if (the_days == "Sunday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(0, 4, date);
                                                        }
                                                        else if (the_days == "Saturday" || the_days == "Weekend") {
                                                            new_date = mycalen.nthWeekdayOfMonth(6, 4, date);
                                                        }
                                                        else if (the_days == "Monday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(1, 4, date);
                                                        }
                                                        else if (the_days == "Tuesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(2, 4, date);
                                                        }
                                                        else if (the_days == "Wednesday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(3, 4, date);
                                                        }
                                                        else if (the_days == "Thursday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(4, 4, date);
                                                        }
                                                        else if (the_days == "Friday" || the_days == "Weekday") {
                                                            new_date = mycalen.nthWeekdayOfMonth(5, 4, date);
                                                        }


                                                    }

                                                    if (new_date == date) {
                                                        //start logic daily frequency occurnce
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Monthly Setting The");

                                                            var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                var next_date_inbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                                                item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    var next_date_inbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                    //list_arr_inbound.push(item);
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    var next_date_inbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                    //list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }
                                                        // end logic daily frequency occurnce
                                                        /* var next_date_inbound = new Date(date.setMonth(date.getMonth()+parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                                       if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                       {
                                                           item.schedule_setting.next_date_inbound = next_date_inbound;
                                                           list_arr_inbound.push(item);
                                                       } */
                                                    }
                                                    else {
                                                        console.log("monthly the setting not match with date >>" + new_date);
                                                    }
                                                }

                                            }
                                            else {
                                                console.log("monthly next date set in array");
                                            }
                                        }
                                        else if (item.schedule_setting.occurs_inbound == "weekly") {
                                            var weekdaycounter = 0;
                                            item.schedule_setting.occurs_weekly_fields_inbound.forEach(weekday => {
                                                if (weekday.day == "Monday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 1) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 1))
                                                        }
                                                        else if (weekdate.getDay() <= 1) {
                                                            weekdate.setDate(weekdate.getDate() - (1 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }

                                                    if (date_ob.getDay() == 1) {
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }
                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Tuesday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 2) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 2))
                                                        }
                                                        else if (weekdate.getDay() <= 2) {
                                                            weekdate.setDate(weekdate.getDate() + (2 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }

                                                    if (date_ob.getDay() == 2) {
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Wednesday") {

                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 3) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 3))
                                                        }
                                                        else if (weekdate.getDay() <= 3) {
                                                            weekdate.setDate(weekdate.getDate() + (3 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 3) {
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Thursday") {

                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 4) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 4))
                                                        }
                                                        else if (weekdate.getDay() <= 4) {
                                                            weekdate.setDate(weekdate.getDate() + (4 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count, weekdate);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 4) {

                                                        console.log("occurs Once found in Weekly Setting");
                                                        if (item.schedule_setting.monthly_frequency_day_inbound == today_date) {
                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Friday") {
                                                    if (weekdaycounter == 0) {
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 5) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 5))
                                                        }
                                                        else if (weekdate.getDay() <= 5) {
                                                            weekdate.setDate(weekdate.getDate() + (5 - weekdate.getDay()))
                                                        }
                                                        var mycalen = new my_calender();
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count, weekdate);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 5) {

                                                        console.log("occurs Once found in Weekly Setting");
                                                        if (item.schedule_setting.monthly_frequency_day_inbound == today_date) {
                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Saturday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 6) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 6))
                                                        }
                                                        else if (weekdate.getDay() <= 6) {
                                                            weekdate.setDate(weekdate.getDate() + (6 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count, weekdate);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 6) {
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }
                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Sunday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 0) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 0))
                                                        }
                                                        else if (weekdate.getDay() <= 0) {
                                                            weekdate.setDate(weekdate.getDate() + (0 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_inbound_count, weekdate);
                                                        item.schedule_setting.next_date_inbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 0) {
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_inbound) {
                                                                //item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                list_arr_inbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_inbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting inbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_inbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_inbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_inbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    item.schedule_setting.next_date_inbound = next_date_inbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_inbound_count));
                                                                        // item.schedule_setting.next_date_inbound = next_date_inbound_days;
                                                                    }
                                                                    else {

                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_inbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_inbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        item.schedule_setting.daily_frequency_every_time_count_inbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_inbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_inbound_count)));
                                                                    // item.schedule_setting.next_date_inbound = next_date_inbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_inbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                        {
                    
                                                            list_arr_inbound.push(item);
                                                        } */
                                                    }
                                                }
                                                weekdaycounter++;
                                            })

                                            //list_arr_inbound.push(item);
                                        }
                                    }
                                    else
                                    {
                                        console.log("current date and next date not match");
                                        console.log("current date"+currentdate);
                                        console.log("next date"+createnextdate);
                                    }
                                }
                                else {
                                    console.log("start date not match >>" + start_date);
                                    if (date_ob >= start_date) {

                                        console.log("date_ob is grater than start date");
                                    }
                                    else {
                                        console.log("date_ob not  grater than start date");
                                    }
                                }
                            }
                            else {
                                console.log("schedule type OneTime Found");
                                var todyasdate = date_ob.getFullYear() + "-" + ('0' + parseInt(date_ob.getMonth() + 1)).slice(-2) + "-" + ('0' + parseInt(date_ob.getDate())).slice(-2);
                                if (todyasdate == item.schedule_setting.one_time_occurrence_inbound_date && currenttime == item.schedule_setting.one_time_occurrence_inbound_time) {
                                    console.log("date and time match with onetime schedule type");
                                    //const index = list_arr_inbound.findIndex(object => object.id === item.project_id);
                                    list_arr_inbound.push(item);

                                }
                                else {
                                    console.log("One time schedule date and time not match in inbound >> current date" + todyasdate + " <<< scheduling ontime date is >>>" + item.schedule_setting.one_time_occurrence_inbound_date);
                                    console.log("One time schedule time inbound >> currentime" + currenttime + " <<< scheduling onetime time is >>>" + item.schedule_setting.one_time_occurrence_inbound_time);
                                }

                            }

                        }
                        else {
                            console.log("inbound project=>" + item.schedule_setting.project_id + " set is click_by_user");
                        }
                    }
                    if (item.outbound_setting.is_active == "Active" && item.inbound_setting.sync_type != "API") {

                        if (item.schedule_setting.Schedule_configure_outbound != 'click_by_user') {
                            let date_ob = new Date();
                            if (item.schedule_setting.schedule_type_outbound == "Recurring") {

                                console.log("outbound check for runs" + item.schedule_setting.project_id);
                                var createat = new Date(item.schedule_setting.createdAt);
                                var createddate = createat.getDate() + '-' + createat.getMonth() + '-' + createat.getFullYear();
                                var nextdates = new Date(item.schedule_setting.next_date_outbound);
                                var createnextdate = nextdates.getDate() + '-' + nextdates.getMonth() + '-' + nextdates.getFullYear();
                                if (createddate == createnextdate || item.schedule_setting.next_date_outbound == undefined) {
                                    console.log("outbound runs" + item.schedule_setting.project_id);
                                    if (item.schedule_setting.occurs_outbound == "daily") {
                                        console.log("daily outbound setting found");
                                        var date = new Date();
                                        var mycalen = new my_calender();
                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                            console.log("occurs once found !");
                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                console.log("Outbound time match for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                console.log("Outbound time match in next date for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                console.log("Outbound items count =>" + list_arr_outbound.length);
                                                list_arr_outbound.push(item);
                                            }
                                            else {
                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                            }
                                        }
                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                            console.log("occurs every found");
                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                            var finalstart_hours = start_hours.substring(0, 2);
                                            var finalstart_minute = start_hours.substring(3);
                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                            if (end_hours != "" && end_hours != undefined) {
                                                console.log("end hours found >>" + end_hours);
                                                //daily_frequency_every_time_count_start_outbound
                                                var finalend_hours = end_hours.substring(0, 2);
                                                var finalend_minute = end_hours.substring(3);
                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                //const end =  19 * 60 + 57;
                                                const obdate = new Date();
                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                if (start <= now && now <= end) {
                                                    var new_start_hour = "";
                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                        console.log("hours setting found !");
                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                    }
                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                        console.log("minutes setting found !");
                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        if (finalstart_minute > 59) {
                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                            ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                        }
                                                        else {
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                        }
                                                    }

                                                }
                                                else {
                                                    var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                    item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                }
                                                list_arr_outbound.push(item);
                                            }
                                            else {
                                                console.log("end hours found>>" + end_hours);
                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                //const end =  19 * 60 + 57;
                                                const obdate = new Date();
                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                    if (finalstart_hours > 23) {
                                                        var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                    }
                                                    else {

                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                    }
                                                }
                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                    if (finalstart_minute > 59) {
                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                    }
                                                    else {
                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                    }
                                                }
                                                if (finalstart_hours > 23) {
                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                    var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                    item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                }
                                                else {
                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                    if (start <= now) {
                                                        console.log("array added in queue");
                                                        list_arr_outbound.push(item);
                                                    }
                                                }

                                            }

                                        }
                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                        { 
                                             var next_date_inbound_days = mycalen.addDays(parseInt(item.schedule_setting.recurs_count_outbound));
                                             item.schedule_setting.next_date_outbound = next_date_inbound_days;
                                             console.log("Outbound time match for project id =" +item.schedule_setting.project_id + "time = "+ currenttime);
                                            list_arr_outbound.push(item);
                                        }
                                        else
                                        {
                                         console.log("outbound time not match with server time is=>" +currenttime+"setting time is=>"+item.schedule_setting.recurs_time_outbound);
                                        } */
                                        //list_arr_outbound.push(item);
                                    }
                                    else if (item.schedule_setting.occurs_outbound == "monthly") {

                                        if (item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day == "day") {
                                            var today_date = date_ob.getDate();
                                            //console.log("today_date"+today_date);
                                            if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                console.log("occurs Once found in Monthly Setting");
                                                if (item.schedule_setting.monthly_frequency_day_outbound == today_date) {
                                                    var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                    if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                        item.schedule_setting.next_date_outbound = next_date_outbound;
                                                        list_arr_outbound.push(item);
                                                    }
                                                    else {

                                                        console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                    }
                                                }
                                                else {
                                                    console.log("monthly setting not match with todays date monthly date currently set is" + item.schedule_setting.monthly_frequency_day_outbound);
                                                }
                                            }
                                            if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                console.log("occurs every found in monthly setting outbound");
                                                var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                var finalstart_hours = start_hours.substring(0, 2);
                                                var finalstart_minute = start_hours.substring(3);
                                                var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                if (end_hours != "" && end_hours != undefined) {
                                                    console.log("end hours found >>" + end_hours);
                                                    //daily_frequency_every_time_count_start_outbound
                                                    var finalend_hours = end_hours.substring(0, 2);
                                                    var finalend_minute = end_hours.substring(3);
                                                    const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                    //const end =  19 * 60 + 57;
                                                    const obdate = new Date();
                                                    const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                    if (start <= now && now <= end) {
                                                        var new_start_hour = "";
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                            console.log("hours setting found !");
                                                            finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                        }
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                            console.log("minutes setting found !");
                                                            finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_minute > 59) {
                                                                finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                            }
                                                            else {
                                                                ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                            }
                                                        }
                                                        list_arr_outbound.push(item);
                                                    }
                                                    else {
                                                        var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound;
                                                    }
                                                }
                                                else {
                                                    console.log("end hours found>>" + end_hours);
                                                    const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    //const end =  19 * 60 + 57;
                                                    const obdate = new Date();
                                                    const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        if (finalstart_hours > 23) {
                                                            var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                        }
                                                        else {

                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                        }
                                                    }
                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        if (finalstart_minute > 59) {
                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                        }
                                                        else {
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                        }
                                                    }
                                                    if (finalstart_hours > 23) {
                                                        console.log("final hours grater than 23 >>" + finalstart_hours);
                                                        var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound;
                                                    }
                                                    else {
                                                        console.log("final start hours < 23 >>" + finalstart_hours);
                                                        if (start <= now) {
                                                            console.log("array added in queue");
                                                            list_arr_outbound.push(item);
                                                        }
                                                    }

                                                }

                                            }
                                        }
                                        if (item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day == "The") {
                                            var the_day_of = item.schedule_setting.monthly_field_setting_outbound[0].the_day_of;
                                            var the_days = item.schedule_setting.monthly_field_setting_outbound[0].the_days;
                                            var new_date;
                                            var date = new Date();
                                            var mycalen = new my_calender();
                                            if (the_day_of == "first") {


                                                if (the_days == "Sunday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(0, 1, date);
                                                }
                                                else if (the_days == "Saturday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(6, 1, date);
                                                }
                                                else if (the_days == "Monday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(1, 1, date);
                                                }
                                                else if (the_days == "Tuesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(2, 1, date);
                                                }
                                                else if (the_days == "Wednesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(3, 1, date);
                                                }
                                                else if (the_days == "Thursday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(4, 1, date);
                                                }
                                                else if (the_days == "Friday" || the_days == "Weekday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(5, 1, date);
                                                }

                                            }
                                            else if (the_day_of == "second") {
                                                if (the_days == "Sunday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(0, 2, date);
                                                }
                                                else if (the_days == "Saturday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(6, 2, date);
                                                }
                                                else if (the_days == "Monday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(1, 2, date);
                                                }
                                                else if (the_days == "Tuesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(2, 2, date);
                                                }
                                                else if (the_days == "Wednesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(3, 2, date);
                                                }
                                                else if (the_days == "Thursday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(4, 2, date);
                                                }
                                                else if (the_days == "Friday" || the_days == "Weekday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(5, 2, date);
                                                }
                                            }
                                            else if (the_day_of == "third") {
                                                if (the_days == "Sunday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(0, 3, date);
                                                }
                                                else if (the_days == "Saturday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(6, 3, date);
                                                }
                                                else if (the_days == "Monday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(1, 3, date);
                                                }
                                                else if (the_days == "Tuesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(2, 3, date);
                                                }
                                                else if (the_days == "Wednesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(3, 3, date);
                                                }
                                                else if (the_days == "Thursday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(4, 3, date);
                                                }
                                                else if (the_days == "Friday" || the_days == "Weekday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(5, 3, date);
                                                }
                                            }
                                            else if (the_day_of == "Fourth") {
                                                if (the_days == "Sunday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(0, 4, date);
                                                }
                                                else if (the_days == "Saturday" || the_days == "Weekend") {
                                                    new_date = mycalen.nthWeekdayOfMonth(6, 4, date);
                                                }
                                                else if (the_days == "Monday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(1, 4, date);
                                                }
                                                else if (the_days == "Tuesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(2, 4, date);
                                                }
                                                else if (the_days == "Wednesday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(3, 4, date);
                                                }
                                                else if (the_days == "Thursday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(4, 4, date);
                                                }
                                                else if (the_days == "Friday" || the_days == "Weekday") {
                                                    new_date = mycalen.nthWeekdayOfMonth(5, 4, date);
                                                }


                                            }

                                            if (new_date == date) {
                                                //start logic daily frequency occurnce
                                                if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                    console.log("occurs Once found in Monthly Setting The");

                                                    var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                    if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                        var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound;
                                                        list_arr_outbound.push(item);
                                                    }
                                                    else {

                                                        console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                    }

                                                }
                                                if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                    console.log("occurs every found in monthly setting outbound");
                                                    var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                    var finalstart_hours = start_hours.substring(0, 2);
                                                    var finalstart_minute = start_hours.substring(3);
                                                    var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                    if (end_hours != "" && end_hours != undefined) {
                                                        console.log("end hours found >>" + end_hours);
                                                        //daily_frequency_every_time_count_start_outbound
                                                        var finalend_hours = end_hours.substring(0, 2);
                                                        var finalend_minute = end_hours.substring(3);
                                                        const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                        const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                        //const end =  19 * 60 + 57;
                                                        const obdate = new Date();
                                                        const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                        if (start <= now && now <= end) {
                                                            var new_start_hour = "";
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                console.log("hours setting found !");
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                console.log("minutes setting found !");
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {
                                                            var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            //list_arr_outbound.push(item);
                                                        }
                                                    }
                                                    else {
                                                        console.log("end hours found>>" + end_hours);
                                                        const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                        //const end =  19 * 60 + 57;
                                                        const obdate = new Date();
                                                        const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                            finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_hours > 23) {
                                                                var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                            }
                                                            else {

                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                            }
                                                        }
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                            finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_minute > 59) {
                                                                finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                            }
                                                            else {
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                            }
                                                        }
                                                        if (finalstart_hours > 23) {
                                                            console.log("final hours grater than 23 >>" + finalstart_hours);
                                                            var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            //list_arr_outbound.push(item);
                                                        }
                                                        else {
                                                            console.log("final start hours < 23 >>" + finalstart_hours);
                                                            if (start <= now) {
                                                                console.log("array added in queue");
                                                                list_arr_outbound.push(item);
                                                            }
                                                        }

                                                    }

                                                }
                                                // end logic daily frequency occurnce
                                                /* var next_date_inbound = new Date(date.setMonth(date.getMonth()+parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                               if(currenttime==item.schedule_setting.recurs_time_inbound)
                                               {
                                                   item.schedule_setting.next_date_inbound = next_date_inbound;
                                                   list_arr_inbound.push(item);
                                               } */
                                            }
                                            else {
                                                console.log("monthly the setting not match with date >>" + new_date);
                                            }
                                        }


                                    }
                                    else if (item.schedule_setting.occurs_outbound == "weekly") {
                                        var weekdaycounter = 0;
                                        item.schedule_setting.occurs_weekly_fields_outbound.forEach(weekday => {
                                            if (weekday.day == "Monday") {
                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 1) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 1))
                                                    }
                                                    else if (weekdate.getDay() <= 1) {
                                                        weekdate.setDate(weekdate.getDate() - (1 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }

                                                if (date_ob.getDay() == 1) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }
                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Tuesday") {
                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 2) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 2))
                                                    }
                                                    else if (weekdate.getDay() <= 2) {
                                                        weekdate.setDate(weekdate.getDate() + (2 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }

                                                if (date_ob.getDay() == 2) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }

                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Wednesday") {

                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 3) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 3))
                                                    }
                                                    else if (weekdate.getDay() <= 3) {
                                                        weekdate.setDate(weekdate.getDate() + (3 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }
                                                if (date_ob.getDay() == 3) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }

                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Thursday") {

                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 4) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 4))
                                                    }
                                                    else if (weekdate.getDay() <= 4) {
                                                        weekdate.setDate(weekdate.getDate() + (4 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }
                                                if (date_ob.getDay() == 4) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                   // //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }

                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Friday") {
                                                if (weekdaycounter == 0) {
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 5) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 5))
                                                    }
                                                    else if (weekdate.getDay() <= 5) {
                                                        weekdate.setDate(weekdate.getDate() + (5 - weekdate.getDay()))
                                                    }
                                                    var mycalen = new my_calender();
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }
                                                if (date_ob.getDay() == 5) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }

                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Saturday") {
                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 6) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 6))
                                                    }
                                                    else if (weekdate.getDay() <= 6) {
                                                        weekdate.setDate(weekdate.getDate() + (6 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }
                                                if (date_ob.getDay() == 6) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                   // //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                   ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }
                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            if (weekday.day == "Sunday") {
                                                if (weekdaycounter == 0) {
                                                    var mycalen = new my_calender();
                                                    var weekdate = new Date();
                                                    if (weekdate.getDay() > 0) {
                                                        weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 0))
                                                    }
                                                    else if (weekdate.getDay() <= 0) {
                                                        weekdate.setDate(weekdate.getDate() + (0 - weekdate.getDay()))
                                                    }
                                                    var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                    item.schedule_setting.next_date_outbound = date;
                                                    weekdaycounter++;
                                                }
                                                if (date_ob.getDay() == 0) {
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Weekly Setting");

                                                        //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    ////daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                   // //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }

                                                    /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                    {
                
                                                        list_arr_outbound.push(item);
                                                    } */
                                                }
                                            }
                                            weekdaycounter++;
                                        })
                                        //list_arr_outbound.push(item);
                                    }
                                }
                                else {
                                    var curdate = new Date();
                                    //var todaysdate = new Date(curdate.getFullYear(), curdate.getMonth(), curdate.getDate());
                                    var todaysdate = curdate.getFullYear() + '-' + curdate.getMonth() + '-' + curdate.getDate();
                                    var nextdate = new Date(item.schedule_setting.next_date_outbound);
                                    //var nextdategen = new Date(nextdate.getFullYear(), nextdate.getMonth(), nextdate.getDate());
                                    var nextdategen = nextdate.getFullYear() + '-' + nextdate.getMonth() + '-' + nextdate.getDate();

                                    if (nextdategen == todaysdate) {

                                        if (item.schedule_setting.occurs_outbound == "daily") {
                                            console.log("daily outbound setting found");
                                            var date = new Date();
                                            var mycalen = new my_calender();
                                            if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                console.log("occurs once found !");
                                                if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                    console.log("Outbound time match for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                    var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                    item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                    console.log("Outbound time match in next date for project id =" + item.schedule_setting.project_id + "time = " + currenttime);
                                                    console.log("Outbound items count =>" + list_arr_outbound.length);
                                                    list_arr_outbound.push(item);
                                                }
                                                else {
                                                    console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                }
                                            }
                                            if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                console.log("occurs every found");
                                                var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                var finalstart_hours = start_hours.substring(0, 2);
                                                var finalstart_minute = start_hours.substring(3);
                                                var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                if (end_hours != "" && end_hours != undefined) {
                                                    console.log("end hours found >>" + end_hours);
                                                    //daily_frequency_every_time_count_start_outbound
                                                    var finalend_hours = end_hours.substring(0, 2);
                                                    var finalend_minute = end_hours.substring(3);
                                                    const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                    //const end =  19 * 60 + 57;
                                                    const obdate = new Date();
                                                    const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                    if (start <= now && now <= end) {
                                                        var new_start_hour = "";
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                            console.log("hours setting found !");
                                                            finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                        }
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                            console.log("minutes setting found !");
                                                            finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_minute > 59) {
                                                                finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                            }
                                                            else {
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                            }
                                                        }

                                                    }
                                                    else {
                                                        var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                    }
                                                    list_arr_outbound.push(item);
                                                }
                                                else {
                                                    console.log("end hours found>>" + end_hours);
                                                    const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                    //const end =  19 * 60 + 57;
                                                    const obdate = new Date();
                                                    const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        if (finalstart_hours > 23) {
                                                            var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                        }
                                                        else {

                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                        }
                                                    }
                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                        if (finalstart_minute > 59) {
                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                        }
                                                        else {
                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                        }
                                                    }
                                                    if (finalstart_hours > 23) {
                                                        console.log("final hours grater than 23 >>" + finalstart_hours);
                                                        var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                        item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                    }
                                                    else {
                                                        console.log("final start hours < 23 >>" + finalstart_hours);
                                                        if (start <= now) {
                                                            console.log("array added in queue");
                                                            list_arr_outbound.push(item);
                                                        }
                                                    }

                                                }

                                            }
                                            /* console.log("daily setting found");
                                            if(currenttime==item.schedule_setting.recurs_time_outbound)
                                            {
                                            var date = new Date();
                                            var mycalen = new my_calender();
                                            var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.recurs_count_outbound));
                                            item.schedule_setting.next_date_outbound = next_date_inbound_days;
                                                list_arr_outbound.push(item);
                                            }
                                            else
                                            {
                                            console.log("outbound time not match with server time is=>" +currenttime+"setting time is=>"+item.schedule_setting.recurs_time_outbound);
                                            } */
                                            //list_arr_outbound.push(item);
                                        }
                                        else if (item.schedule_setting.occurs_outbound == "monthly") {

                                            if (item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day == "day") {
                                                var today_date = date_ob.getDate();
                                                //console.log("today_date"+today_date);
                                                if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                    console.log("occurs Once found in Monthly Setting");
                                                    if (item.schedule_setting.monthly_frequency_day_outbound == today_date) {
                                                        var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }
                                                    }
                                                    else {
                                                        console.log("monthly setting not match with todays date monthly date currently set is" + item.schedule_setting.monthly_frequency_day_outbound);
                                                    }
                                                }
                                                if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                    console.log("occurs every found in monthly setting outbound");
                                                    var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                    var finalstart_hours = start_hours.substring(0, 2);
                                                    var finalstart_minute = start_hours.substring(3);
                                                    var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                    if (end_hours != "" && end_hours != undefined) {
                                                        console.log("end hours found >>" + end_hours);
                                                        //daily_frequency_every_time_count_start_outbound
                                                        var finalend_hours = end_hours.substring(0, 2);
                                                        var finalend_minute = end_hours.substring(3);
                                                        const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                        const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                        //const end =  19 * 60 + 57;
                                                        const obdate = new Date();
                                                        const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                        if (start <= now && now <= end) {
                                                            var new_start_hour = "";
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                console.log("hours setting found !");
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                console.log("minutes setting found !");
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {
                                                            var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                        }
                                                    }
                                                    else {
                                                        console.log("end hours found>>" + end_hours);
                                                        const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                        //const end =  19 * 60 + 57;
                                                        const obdate = new Date();
                                                        const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                            finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_hours > 23) {
                                                                var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                            }
                                                            else {

                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                            }
                                                        }
                                                        if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                            finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                            if (finalstart_minute > 59) {
                                                                finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                            }
                                                            else {
                                                                //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                            }
                                                        }
                                                        if (finalstart_hours > 23) {
                                                            console.log("final hours grater than 23 >>" + finalstart_hours);
                                                            var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                        }
                                                        else {
                                                            console.log("final start hours < 23 >>" + finalstart_hours);
                                                            if (start <= now) {
                                                                console.log("array added in queue");
                                                                list_arr_outbound.push(item);
                                                            }
                                                        }

                                                    }

                                                }
                                            }
                                            if (item.schedule_setting.monthly_field_setting_outbound[0].outbound_monthly_day == "The") {
                                                var the_day_of = item.schedule_setting.monthly_field_setting_outbound[0].the_day_of;
                                                var the_days = item.schedule_setting.monthly_field_setting_outbound[0].the_days;
                                                var new_date;
                                                var date = new Date();
                                                var mycalen = new my_calender();
                                                if (the_day_of == "first") {


                                                    if (the_days == "Sunday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(0, 1, date);
                                                    }
                                                    else if (the_days == "Saturday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(6, 1, date);
                                                    }
                                                    else if (the_days == "Monday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(1, 1, date);
                                                    }
                                                    else if (the_days == "Tuesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(2, 1, date);
                                                    }
                                                    else if (the_days == "Wednesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(3, 1, date);
                                                    }
                                                    else if (the_days == "Thursday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(4, 1, date);
                                                    }
                                                    else if (the_days == "Friday" || the_days == "Weekday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(5, 1, date);
                                                    }

                                                }
                                                else if (the_day_of == "second") {
                                                    if (the_days == "Sunday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(0, 2, date);
                                                    }
                                                    else if (the_days == "Saturday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(6, 2, date);
                                                    }
                                                    else if (the_days == "Monday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(1, 2, date);
                                                    }
                                                    else if (the_days == "Tuesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(2, 2, date);
                                                    }
                                                    else if (the_days == "Wednesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(3, 2, date);
                                                    }
                                                    else if (the_days == "Thursday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(4, 2, date);
                                                    }
                                                    else if (the_days == "Friday" || the_days == "Weekday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(5, 2, date);
                                                    }
                                                }
                                                else if (the_day_of == "third") {
                                                    if (the_days == "Sunday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(0, 3, date);
                                                    }
                                                    else if (the_days == "Saturday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(6, 3, date);
                                                    }
                                                    else if (the_days == "Monday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(1, 3, date);
                                                    }
                                                    else if (the_days == "Tuesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(2, 3, date);
                                                    }
                                                    else if (the_days == "Wednesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(3, 3, date);
                                                    }
                                                    else if (the_days == "Thursday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(4, 3, date);
                                                    }
                                                    else if (the_days == "Friday" || the_days == "Weekday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(5, 3, date);
                                                    }
                                                }
                                                else if (the_day_of == "Fourth") {
                                                    if (the_days == "Sunday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(0, 4, date);
                                                    }
                                                    else if (the_days == "Saturday" || the_days == "Weekend") {
                                                        new_date = mycalen.nthWeekdayOfMonth(6, 4, date);
                                                    }
                                                    else if (the_days == "Monday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(1, 4, date);
                                                    }
                                                    else if (the_days == "Tuesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(2, 4, date);
                                                    }
                                                    else if (the_days == "Wednesday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(3, 4, date);
                                                    }
                                                    else if (the_days == "Thursday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(4, 4, date);
                                                    }
                                                    else if (the_days == "Friday" || the_days == "Weekday") {
                                                        new_date = mycalen.nthWeekdayOfMonth(5, 4, date);
                                                    }


                                                }

                                                if (new_date == date) {
                                                    //start logic daily frequency occurnce
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                        console.log("occurs Once found in Monthly Setting The");

                                                        var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth() + parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                        if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                            var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                            item.schedule_setting.next_date_outbound = next_date_outbound;
                                                            list_arr_outbound.push(item);
                                                        }
                                                        else {

                                                            console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                        }

                                                    }
                                                    if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                        console.log("occurs every found in monthly setting outbound");
                                                        var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                        var finalstart_hours = start_hours.substring(0, 2);
                                                        var finalstart_minute = start_hours.substring(3);
                                                        var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                        if (end_hours != "" && end_hours != undefined) {
                                                            console.log("end hours found >>" + end_hours);
                                                            //daily_frequency_every_time_count_start_outbound
                                                            var finalend_hours = end_hours.substring(0, 2);
                                                            var finalend_minute = end_hours.substring(3);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                            if (start <= now && now <= end) {
                                                                var new_start_hour = "";
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    console.log("hours setting found !");
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    console.log("minutes setting found !");
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                //list_arr_outbound.push(item);
                                                            }
                                                        }
                                                        else {
                                                            console.log("end hours found>>" + end_hours);
                                                            const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                            //const end =  19 * 60 + 57;
                                                            const obdate = new Date();
                                                            const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_hours > 23) {
                                                                    var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                }
                                                                else {

                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                }
                                                            }
                                                            if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                if (finalstart_minute > 59) {
                                                                    finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                }
                                                                else {
                                                                    //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                }
                                                            }
                                                            if (finalstart_hours > 23) {
                                                                console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                var next_date_outbound = new Date(date.setMonth(date.getMonth() + parseInt(item.schedule_setting.monthly_frequency_the_outbound_count)));
                                                                item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                //list_arr_outbound.push(item);
                                                            }
                                                            else {
                                                                console.log("final start hours < 23 >>" + finalstart_hours);
                                                                if (start <= now) {
                                                                    console.log("array added in queue");
                                                                    list_arr_outbound.push(item);
                                                                }
                                                            }

                                                        }

                                                    }
                                                    // end logic daily frequency occurnce
                                                    /* var next_date_inbound = new Date(date.setMonth(date.getMonth()+parseInt(item.schedule_setting.monthly_frequency_the_inbound_count)));
                                                if(currenttime==item.schedule_setting.recurs_time_inbound)
                                                {
                                                    item.schedule_setting.next_date_inbound = next_date_inbound;
                                                    list_arr_inbound.push(item);
                                                } */
                                                }
                                                else {
                                                    console.log("monthly the setting not match with date >>" + new_date);
                                                }
                                            }


                                        }
                                        else if (item.schedule_setting.occurs_outbound == "weekly") {
                                            var weekdaycounter = 0;
                                            item.schedule_setting.occurs_weekly_fields_outbound.forEach(weekday => {
                                                if (weekday.day == "Monday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 1) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 1))
                                                        }
                                                        else if (weekdate.getDay() <= 1) {
                                                            weekdate.setDate(weekdate.getDate() - (1 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }

                                                    if (date_ob.getDay() == 1) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }
                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Tuesday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 2) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 2))
                                                        }
                                                        else if (weekdate.getDay() <= 2) {
                                                            weekdate.setDate(weekdate.getDate() + (2 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }

                                                    if (date_ob.getDay() == 2) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Wednesday") {

                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 3) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 3))
                                                        }
                                                        else if (weekdate.getDay() <= 3) {
                                                            weekdate.setDate(weekdate.getDate() + (3 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 3) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Thursday") {

                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 4) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 4))
                                                        }
                                                        else if (weekdate.getDay() <= 4) {
                                                            weekdate.setDate(weekdate.getDate() + (4 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 4) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Friday") {
                                                    if (weekdaycounter == 0) {
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 5) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 5))
                                                        }
                                                        else if (weekdate.getDay() <= 5) {
                                                            weekdate.setDate(weekdate.getDate() + (5 - weekdate.getDay()))
                                                        }
                                                        var mycalen = new my_calender();
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 5) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Saturday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 6) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 6))
                                                        }
                                                        else if (weekdate.getDay() <= 6) {
                                                            weekdate.setDate(weekdate.getDate() + (6 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 6) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }
                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                if (weekday.day == "Sunday") {
                                                    if (weekdaycounter == 0) {
                                                        var mycalen = new my_calender();
                                                        var weekdate = new Date();
                                                        if (weekdate.getDay() > 0) {
                                                            weekdate.setDate(weekdate.getDate() - (weekdate.getDay() - 0))
                                                        }
                                                        else if (weekdate.getDay() <= 0) {
                                                            weekdate.setDate(weekdate.getDate() + (0 - weekdate.getDay()))
                                                        }
                                                        var date = mycalen.addWeeks(item.schedule_setting.weekly_frequency_outbound_count, weekdate);
                                                        item.schedule_setting.next_date_outbound = date;
                                                        weekdaycounter++;
                                                    }
                                                    if (date_ob.getDay() == 0) {
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                            console.log("occurs Once found in Weekly Setting");

                                                            //var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                            if (currenttime == item.schedule_setting.daily_frequency_once_time_outbound) {
                                                                //item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                list_arr_outbound.push(item);
                                                            }
                                                            else {

                                                                console.log("occurnce once found time is >>" + item.schedule_setting.daily_frequency_once_time_outbound);
                                                            }

                                                        }
                                                        if (item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                            console.log("occurs every found in monthly setting outbound");
                                                            var start_hours = item.schedule_setting.daily_frequency_every_time_count_start_outbound;
                                                            var finalstart_hours = start_hours.substring(0, 2);
                                                            var finalstart_minute = start_hours.substring(3);
                                                            var end_hours = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                            if (end_hours != "" && end_hours != undefined) {
                                                                console.log("end hours found >>" + end_hours);
                                                                //daily_frequency_every_time_count_start_outbound
                                                                var finalend_hours = end_hours.substring(0, 2);
                                                                var finalend_minute = end_hours.substring(3);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                const end = parseInt(finalend_hours) * 60 + parseInt(finalend_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();
                                                                if (start <= now && now <= end) {
                                                                    var new_start_hour = "";
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                        console.log("hours setting found !");
                                                                        finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                    if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                        console.log("minutes setting found !");
                                                                        finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                        if (finalstart_minute > 59) {
                                                                            finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                        }
                                                                        else {
                                                                            //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                        }
                                                                    }
                                                                    list_arr_outbound.push(item);
                                                                }
                                                                else {
                                                                    /* var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    item.schedule_setting.next_date_outbound = next_date_outbound; */
                                                                }
                                                            }
                                                            else {
                                                                console.log("end hours found>>" + end_hours);
                                                                const start = parseInt(finalstart_hours) * 60 + parseInt(finalstart_minute);
                                                                //const end =  19 * 60 + 57;
                                                                const obdate = new Date();
                                                                const now = obdate.getHours() * 60 + obdate.getMinutes();


                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "hour") {
                                                                    finalstart_hours = parseInt(finalstart_hours) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_hours > 23) {
                                                                        // var next_date_outbound_days = mycalen.addDays(parseInt(item.schedule_setting.day_frequency_outbound_count));
                                                                        // item.schedule_setting.next_date_outbound = next_date_outbound_days;
                                                                    }
                                                                    else {

                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalend_minute;
                                                                    }
                                                                }
                                                                if (item.schedule_setting.daily_frequency_every_time_unit_outbound == "minute") {
                                                                    finalstart_minute = parseInt(finalstart_minute) + parseInt(item.schedule_setting.daily_frequency_every_time_count_outbound);
                                                                    if (finalstart_minute > 59) {
                                                                        finalstart_hours = parseInt(finalstart_hours) + 1;
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + 0 + "'";
                                                                    }
                                                                    else {
                                                                        //daily_frequency_every_time_count_outbound = "'" + finalstart_hours + ":" + finalstart_minute + "'";
                                                                    }
                                                                }
                                                                if (finalstart_hours > 23) {
                                                                    console.log("final hours grater than 23 >>" + finalstart_hours);
                                                                    // var next_date_outbound = new Date(date_ob.setMonth(date_ob.getMonth()+parseInt(item.schedule_setting.monthly_frequency_day_outbound_count)));
                                                                    // item.schedule_setting.next_date_outbound = next_date_outbound;
                                                                }
                                                                else {
                                                                    console.log("final start hours < 23 >>" + finalstart_hours);
                                                                    if (start <= now) {
                                                                        console.log("array added in queue");
                                                                        list_arr_outbound.push(item);
                                                                    }
                                                                }

                                                            }

                                                        }

                                                        /* if(currenttime==item.schedule_setting.recurs_time_outbound)
                                                        {
                    
                                                            list_arr_outbound.push(item);
                                                        } */
                                                    }
                                                }
                                                weekdaycounter++;
                                            })
                                            //list_arr_outbound.push(item);
                                        }
                                    }
                                    else {
                                        console.log("next date =>" + nextdategen);
                                    }
                                }
                            }
                            else {
                                console.log("schedule type OneTime Found in outbound");
                                var todyasdate = date_ob.getFullYear() + "-" + ('0' + parseInt(date_ob.getMonth() + 1)).slice(-2) + "-" + ('0' + parseInt(date_ob.getDate())).slice(-2);
                                if (todyasdate == item.schedule_setting.one_time_occurrence_outbound_date && currenttime == item.schedule_setting.one_time_occurrence_outbound_time) {
                                    console.log("date and time match with onetime schedule type outbound");
                                    list_arr_outbound.push(item);

                                }
                                else {

                                    console.log("One time schedule date and time not match in outbound >> current date" + todyasdate + " <<< scheduling ontime date is >>>" + item.schedule_setting.one_time_occurrence_outbound_date);
                                    console.log("One time schedule time outbound >> currentime" + currenttime + " <<< scheduling onetime time is >>>" + item.schedule_setting.one_time_occurrence_outbound_time);
                                }
                            }
                        }
                        else {
                            console.log("outbound project=>" + item.schedule_setting.project_id + " set is click_by_user");
                        }
                    }

                }

               
                //var currenttime = date_ob.getHours() + ":" +date_ob.getMinutes();
                //res.json(currenttime);
                //res.json('total schedule running now'+scheduelerunning);
                //console.log(list_arr_inbound);
                
            });
            //console.log("total inbound runs");
            if (typeof list_arr_inbound !== 'undefined' && list_arr_inbound.length > 0) {
                let date_ob = new Date();
                var day = ('0' + date_ob.getDate()).slice(-2);
                var month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
                var year = date_ob.getFullYear();
                var gettodaydate = year + '-' + month + '-' + day;
                // the array is defined and has at least one element
                list_arr_inbound.forEach(item => {
                    var start_flag_inbound = "false";

                    if (Date.parse(item.schedule_setting.duration_inbound_start_date) <= Date.parse(gettodaydate)) {
                        if (item.schedule_setting.duration_inbound_is_end_date == "yes_end_date") {
                            console.log("end date set");
                            if (Date.parse(item.schedule_setting.duration_inbound_end_date) > Date.parse(gettodaydate)) {
                                console.log("duration end date grater than today enddate = " + item.schedule_setting.duration_inbound_end_date);
                                start_flag_inbound = "true";
                            }
                            else {
                                console.log("end date reach in time inbound => " + item.schedule_setting.duration_outbound_end_date);
                                start_flag_inbound = "false";
                            }
                        }
                        else {
                            start_flag_inbound = "true";
                        }
                    } else {
                        console.log("start date not match inbound");
                    }


                    if (start_flag_inbound == "true") {
                        console.log("time match inbound");
                        console.log("Inbound run for project :" + item.inbound_setting.project_id);
                        var host = item.inbound_setting.ftp_server_link;
                        var port = item.inbound_setting.port;
                        var username = item.inbound_setting.login_name;
                        var password = item.inbound_setting.password;
                        var folder = item.inbound_setting.folder;
                        var project_id = item.inbound_setting.project_id;
                        var project_code = item.ProjectCode;
                        //const client = new ftp(host, port, username ,password, true);
                        // console.log(client.clientList());

                        try {
                            if (project_id != undefined && project_id != "") {

                                //console.log(result);

                                var options = {
                                    'method': 'POST',
                                    'url': config.domain + '/inbound/inboundrun',
                                    'headers': {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({

                                        "project_id": project_id,

                                    })

                                };
                                request(options, function (error, response) {
                                    //console.log(response);
                                    if (error) throw new Error(error);
                                    //console.log(JSON.parse(response.body));
                                    //scheduelerunning++;

                                    var result = JSON.parse(response.body);
                                    var newschedulesetting = item.schedule_setting;
                                    if (result.Status != undefined && result.Status == 1) {
                                        //var date = new Date();
                                        console.log(result);
                                        //newschedulesetting.next_date_inbound = date;
                                        //console.log(newschedulesetting);
                                        var options = {
                                            'method': 'put',
                                            'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newschedulesetting)

                                        };
                                        request(options, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("update schedule setting date");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                        var historyobj = {
                                                "project_id":newschedulesetting.project_id,
                                                "status":"success"
                                        }
                                        var options1 ={
                                            'method': 'post',
                                            'url': config.domain + '/inbound_history/save/',
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(historyobj)
                                        };
                                        request(options1, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("Inbound Successfully Run");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                    }
                                    else
                                    {
                                        var historyobj = {
                                            "project_id":newschedulesetting.project_id,
                                            "status":"fail"
                                        }
                                        var options1 ={
                                            'method': 'post',
                                            'url': config.domain + '/inbound_history/save/',
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(historyobj)
                                        };
                                        request(options1, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("Inbound Successfully Run");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                    }


                                    //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                });
                                //console.log("inbound run");
                            }
                            else {
                                console.log('Project Not Found');
                                //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                            }
                        } catch (err) {
                            console.log('catch' + err);
                            //res.json({'status':'false','msg':'FTP Not Connected'});
                        }
                    }
                });
            }
            if (typeof list_arr_outbound !== 'undefined' && list_arr_outbound.length > 0) {
                // the array is defined and has at least one element
                let date_ob = new Date();
                var day = ('0' + date_ob.getDate()).slice(-2);
                var month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
                var year = date_ob.getFullYear();
                var gettodaydate = year + '-' + month + '-' + day;
                list_arr_outbound.forEach(item => {
                    var start_flag_outbound = "false";

                    if (Date.parse(item.schedule_setting.duration_outbound_start_date) <= Date.parse(gettodaydate)) {
                        if (item.schedule_setting.duration_outbound_is_end_date == "yes_end_date") {
                            console.log("end date set for outbound");
                            if (item.schedule_setting.duration_outbound_end_date > gettodaydate) {
                                start_flag_outbound = "true";
                                console.log("active duration end date");
                            }
                            else {
                                start_flag_outbound = "false";
                                console.log("duration end date grater than today enddate = " + item.schedule_setting.duration_outbound_end_date);
                            }
                        }
                        else {
                            console.log("active duration not set");
                            start_flag_outbound = "true";
                        }
                    } else {
                        console.log("start date not match outbound");
                    }
                    if (start_flag_outbound == "true") {

                        console.log("time match outbound");
                        console.log("outbound run for project :" + item.outbound_setting.project_id);
                        var project_id = item.outbound_setting.project_id;
                        var project_code = item.ProjectCode;

                        // console.log(client.clientList());
                        var options = {
                            'method': 'POST',
                            'url': config.domain + '/inbound/outboundrun',
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "project_id": project_id,
                                "project_code":project_code
                            })
                        }
                        request(options, function (error, response) {
                            if (error) {
                                console.log(error);
                                //throw new Error(error);
                            }
                            else {
                                var result = JSON.parse(response.body);

                                if (result.Status != undefined && result.Status == 1) {
                                    var newschedulesetting = item.schedule_setting;
                                    //var date = new Date();
                                    //newschedulesetting.next_date_inbound = date;
                                    //console.log(newschedulesetting);
                                    var options = {
                                        'method': 'put',
                                        'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newschedulesetting)

                                    };
                                    request(options, function (error, response) {
                                        //console.log(response);
                                        if (error) {
                                            console.log("update schedule setting error");
                                        }
                                        else {


                                            console.log("update schedule setting date");
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });

                                    var historyobj = {
                                        "project_id":newschedulesetting.project_id,
                                        "status":"success"
                                    }
                                    var options1 ={
                                        'method': 'post',
                                        'url': config.domain + '/outbound_history/save/',
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(historyobj)
                                    };
                                    request(options1, function (error, response) {
                                        //console.log(response);
                                        if (error) throw new Error(error)
                                        else {

                                            //console.log(response);
                                            console.log("outbound Successfully Run");
                                            //console.log(newschedulesetting);
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });
                                }
                                else
                                {
                                    var historyobj = {
                                        "project_id":newschedulesetting.project_id,
                                        "status":"fail"
                                    }
                                    var options1 ={
                                        'method': 'post',
                                        'url': config.domain + '/outbound_history/save/',
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(historyobj)
                                    };
                                    request(options1, function (error, response) {
                                        //console.log(response);
                                        if (error) throw new Error(error)
                                        else {

                                            //console.log(response);
                                            console.log("Outbound Run Failed");
                                            //console.log(newschedulesetting);
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });
                                }

                            }
                        })
                    }
                    else {
                        console.log("schedule start date and end date not match");
                    }

                });
            }
            res.end("OK")
            //res.json(list_arr_outbound);
            var total_inbound = list_arr_inbound.length;
            var total_outbound = list_arr_outbound.length;
            //res.json({"Status":"1","Msg":"Total Inbound "+total_inbound + " and total Outbound "+ total_outbound + " Run Successfully","ErrMsg":"","Data":[]});
            //res.json({"status":"1"})
            console.log('running schedule now');
        }
        else {
            res.send(data.message)
        }

        //res.json({"status":true,"data":list_arr_inbound});
    });
})
router.get('/testAPI', function (req, res) {
    var date = new Date();
    var mycalen = new my_calender();
    var date = mycalen.nthWeekdayOfMonth(6, 3, date);
    res.json({ "msg": date });
})
router.get('/scheduling',function(req,res){
    var list_arr_inbound = [];
    var list_arr_outbound = [];
    const milliseconds = (h, m, s) => ((h*60*60+m*60+s)*1000);
    request(config.domain + '/projects/fulllist/', function (error, response, body) {

        var data = JSON.parse(body);
        //console.log(data);
        if (response.statusCode == 200) {
            //console.log(data.data);
            //res.json(data.data);
            //res.render('pages/add-projects',{alldata:data});
            console.log("scanning total project="+data.data.length);
            var couters = 0
            data.data.forEach(item => {
                if (item.schedule_setting != undefined && item.inbound_setting != undefined && item.outbound_setting != undefined && item.isActive == 1) {
                    console.log("active project found");
                    const date_ob = new Date();
                    const static_date = new Date();
                    static_date.setHours(0);
                    static_date.setMinutes(0);
                    static_date.setSeconds(0);
                    static_date.setMilliseconds(0);
                    //let current_time_milisecond = parseInt(date_ob.getTime()-date_ob.getTimezoneOffset()*60*1000);
                    let current_time_milisecond = parseInt(date_ob.getTime());
                    let next_date_milisecond = parseInt(item.schedule_setting.next_date_inbound);
                    let next_date_milisecond_outbound = parseInt(item.schedule_setting.next_date_outbound);
                    var new_next_date_milisecond = next_date_milisecond;
                    var new_next_date_milisecond_outbound = next_date_milisecond_outbound;
                    //console.log(current_time_milisecond);
                    if(item.inbound_setting.is_active == "Active" && item.inbound_setting.api_type != "DDEP_API")
                    {
                        if (item.schedule_setting.Schedule_configure_inbound != 'click_by_user') {
                            if (item.schedule_setting.schedule_type_inbound == "Recurring"){
                                var end_date = '';
                                var end_date_milisecond='';
                                if (item.schedule_setting.duration_inbound_is_end_date == "yes_end_date") {
                                    if (item.schedule_setting.duration_inbound_end_date != "" && item.schedule_setting.duration_inbound_end_date != undefined) {
                                        end_date = new Date(item.schedule_setting.duration_inbound_end_date);
                                        end_date_milisecond = parseInt(end_date.getTime());
                                        console.log("yes end date");
                                        //console.log("set new end date >>" + end_date);
                                    }
                                    else {
                                        console.log("End Date Not Set");
                                    }
                                }
                                if(end_date_milisecond=="" || (end_date_milisecond >=next_date_milisecond)){
                                    //console.log("end date < current date found");
                                    if(new_next_date_milisecond==current_time_milisecond || new_next_date_milisecond <= current_time_milisecond-50000){ 
                                        //var new_next_date_milisecond = next_date_milisecond;
                                        if (item.schedule_setting.occurs_inbound == "daily") {
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                                console.log("occers once found");
                                                new_next_date_milisecond =parseInt(new_next_date_milisecond+(item.schedule_setting.day_frequency_inbound_count*24*60*60*1000));
                                            }
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                                console.log("occurs every found");
                                                var inbound_time=item.schedule_setting.daily_frequency_every_time_count_start_inbound
                                                var inbound_parts = inbound_time.split(":");
                                                var result_inbound = milliseconds(inbound_parts[0], inbound_parts[1], 0);
                                                var inbound_time_end = item.schedule_setting.daily_frequency_every_time_count_end_inbound;
                                                var inbound_end_parts = inbound_time_end.split(":");
                                                var result_inbound_end =  milliseconds(inbound_end_parts[0], inbound_end_parts[1], 0);
                                                var inbuond_end_time_final = parseInt(static_date.getTime()+result_inbound_end);
                                                console.log(inbuond_end_time_final);
                                                if(new_next_date_milisecond <= inbuond_end_time_final)
                                                {
                                                    if(item.schedule_setting.daily_frequency_every_time_unit_inbound=="hour")
                                                    {
                                                        if((new_next_date_milisecond+item.schedule_setting.daily_frequency_every_time_count_inbound*60*60*1000) >=inbuond_end_time_final)
                                                        {
                                                            new_next_date_milisecond = parseInt(static_date.getTime()+item.schedule_setting.day_frequency_inbound_count*24*60*60*1000)+result_inbound;
                                                        }
                                                        else
                                                        {
                                                            new_next_date_milisecond = parseInt(new_next_date_milisecond+(item.schedule_setting.daily_frequency_every_time_count_inbound*60*60*1000));
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if((new_next_date_milisecond+item.schedule_setting.daily_frequency_every_time_count_inbound*60*1000) >=inbuond_end_time_final)
                                                        {
                                                            new_next_date_milisecond = parseInt(static_date.getTime()+item.schedule_setting.day_frequency_inbound_count*24*60*60*1000)+result_inbound;
                                                        }
                                                        else
                                                        {

                                                            new_next_date_milisecond = parseInt(new_next_date_milisecond+(item.schedule_setting.daily_frequency_every_time_count_inbound*60*1000));
                                                        }

                                                    }
                                                }
                                                else
                                                {
                                                    new_next_date_milisecond = next_date_milisecond+(item.schedule_setting.day_frequency_inbound_count*24*60*60*1000);

                                                }
                                                //itemdaily_frequency_every_time_count_start_inbound
                                            }
                                            
                                        }
                                        if (item.schedule_setting.occurs_inbound == "monthly") {
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                            }
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                            }
                                        }
                                        if (item.schedule_setting.occurs_inbound == "weekly") {
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs Once At') {
                                            }
                                            if(item.schedule_setting.daily_frequency_type_inbound == 'Occurs every') {
                                            }
                                        }
                                        item.schedule_setting.next_date_inbound = new_next_date_milisecond
                                        list_arr_inbound.push(item);
                                    }
                                    else
                                    {
                                        console.log("current time not match with schedule time");
                                        console.log("schedule time is"+new Date(parseInt(new_next_date_milisecond+60000)).toString());
                                        console.log("current time is"+new Date(parseInt(current_time_milisecond)).toString());
                                        console.log("milisecond"+new_next_date_milisecond);
                                    }
                                    
                                }
                                else
                                {
                                    console.log("current date setting not match with end date");
                                }
                            }
                            else{

                            }

                        }
                    }
                    if(item.outbound_setting.is_active == "Active")
                    {
                        if (item.schedule_setting.Schedule_configure_outbound != 'click_by_user') {
                            if (item.schedule_setting.schedule_type_outbound == "Recurring"){
                                var end_date = '';
                                var end_date_milisecond='';
                                if (item.schedule_setting.duration_outbound_is_end_date == "yes_end_date") {
                                    if (item.schedule_setting.duration_outbound_end_date != "" && item.schedule_setting.duration_outbound_end_date != undefined) {
                                        end_date = new Date(item.schedule_setting.duration_outbound_end_date);
                                        end_date_milisecond = parseInt(end_date.getTime());
                                        console.log("yes end date");
                                        //console.log("set new end date >>" + end_date);
                                    }
                                    else {
                                        console.log("End Date Not Set");
                                    }
                                }
                                if(end_date_milisecond=="" || (end_date_milisecond >=next_date_milisecond_outbound)){
                                    //console.log("end date < current date found");
                                    if(new_next_date_milisecond_outbound==current_time_milisecond || new_next_date_milisecond_outbound <= current_time_milisecond-50000){ 
                                        //var new_next_date_milisecond_outbound = next_date_milisecond;
                                        if (item.schedule_setting.occurs_outbound == "daily") {
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                                console.log("occers once found");
                                                new_next_date_milisecond_outbound =parseInt(new_next_date_milisecond_outbound+(item.schedule_setting.day_frequency_outbound_count*24*60*60*1000));
                                            }
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                                console.log("occurs every found");
                                                var outbound_time=item.schedule_setting.daily_frequency_every_time_count_start_outbound
                                                var outbound_parts = outbound_time.split(":");
                                                var result_outbound = milliseconds(outbound_parts[0], outbound_parts[1], 0);
                                                var outbound_time_end = item.schedule_setting.daily_frequency_every_time_count_end_outbound;
                                                var outbound_end_parts = outbound_time_end.split(":");
                                                var result_outbound_end =  milliseconds(outbound_end_parts[0], outbound_end_parts[1], 0);
                                                var inbuond_end_time_final = parseInt(static_date.getTime()+result_outbound_end);
                                                console.log(inbuond_end_time_final);
                                                if(new_next_date_milisecond_outbound <= inbuond_end_time_final)
                                                {
                                                    if(item.schedule_setting.daily_frequency_every_time_unit_outbound=="hour")
                                                    {
                                                        if((new_next_date_milisecond_outbound+item.schedule_setting.daily_frequency_every_time_count_outbound*60*60*1000) >=inbuond_end_time_final)
                                                        {
                                                            new_next_date_milisecond_outbound = parseInt(static_date.getTime()+item.schedule_setting.day_frequency_outbound_count*24*60*60*1000)+result_outbound;
                                                        }
                                                        else
                                                        {
                                                            new_next_date_milisecond_outbound = parseInt(new_next_date_milisecond_outbound+(item.schedule_setting.daily_frequency_every_time_count_outbound*60*60*1000));
                                                        }
                                                    }
                                                    else
                                                    {
                                                        if((new_next_date_milisecond_outbound+item.schedule_setting.daily_frequency_every_time_count_outbound*60*1000) >=inbuond_end_time_final)
                                                        {
                                                            new_next_date_milisecond_outbound = parseInt(static_date.getTime()+item.schedule_setting.day_frequency_outbound_count*24*60*60*1000)+result_outbound;
                                                        }
                                                        else
                                                        {

                                                            new_next_date_milisecond_outbound = parseInt(new_next_date_milisecond_outbound+(item.schedule_setting.daily_frequency_every_time_count_outbound*60*1000));
                                                        }

                                                    }
                                                }
                                                else
                                                {
                                                    new_next_date_milisecond_outbound = next_date_milisecond+(item.schedule_setting.day_frequency_outbound_count*24*60*60*1000);

                                                }
                                                //itemdaily_frequency_every_time_count_start_outbound
                                            }
                                            
                                        }
                                        if (item.schedule_setting.occurs_outbound == "monthly") {
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                            }
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                            }
                                        }
                                        if (item.schedule_setting.occurs_outbound == "weekly") {
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs Once At') {
                                            }
                                            if(item.schedule_setting.daily_frequency_type_outbound == 'Occurs every') {
                                            }
                                        }
                                        item.schedule_setting.next_date_outbound = new_next_date_milisecond_outbound
                                        list_arr_outbound.push(item);
                                    }
                                    else
                                    {
                                        console.log("current time not match with schedule time outbound");
                                        console.log("schedule time outbound is"+new Date(parseInt(new_next_date_milisecond_outbound+60000)).toString());
                                        console.log("current time is"+new Date(parseInt(current_time_milisecond)).toString());
                                        console.log("milisecond"+new_next_date_milisecond_outbound);
                                    }
                                    
                                }
                                else
                                {
                                    console.log("current date setting not match with end date");
                                }
                            }
                            else{

                            }

                        }
                    }
                }
            })
            if (typeof list_arr_inbound !== 'undefined' && list_arr_inbound.length > 0) {
                
                // the array is defined and has at least one element
                list_arr_inbound.forEach(item => {
                    var start_flag_inbound = "true";

                    

                    if (start_flag_inbound == "true") {
                        console.log("time match inbound");
                        console.log("Inbound run for project :" + item.inbound_setting.project_id);
                        var host = item.inbound_setting.ftp_server_link;
                        var port = item.inbound_setting.port;
                        var username = item.inbound_setting.login_name;
                        var password = item.inbound_setting.password;
                        var folder = item.inbound_setting.folder;
                        var project_id = item.inbound_setting.project_id;
                        var project_code = item.ProjectCode;
                        //const client = new ftp(host, port, username ,password, true);
                        // console.log(client.clientList());

                        try {
                            if (project_id != undefined && project_id != "") {

                                //console.log(result);

                                var options = {
                                    'method': 'POST',
                                    'url': config.domain + '/inbound/inboundrun',
                                    'headers': {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({

                                        "project_id": project_id,

                                    })

                                };
                                request(options, function (error, response) {
                                    //console.log(response);
                                    if (error) throw new Error(error);
                                    //console.log(JSON.parse(response.body));
                                    //scheduelerunning++;

                                    var result = JSON.parse(response.body);
                                    var newschedulesetting = item.schedule_setting;
                                    if (result.Status != undefined && result.Status == 1) {
                                        //var date = new Date();
                                        console.log(result);
                                        //newschedulesetting.next_date_inbound = date;
                                        console.log(newschedulesetting);
                                        var options = {
                                            'method': 'put',
                                            'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newschedulesetting)

                                        };
                                        request(options, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("update schedule setting date");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                        var historyobj = {
                                                "project_id":newschedulesetting.project_id,
                                                "status":"success"
                                        }
                                        var options1 ={
                                            'method': 'post',
                                            'url': config.domain + '/inbound_history/save/',
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(historyobj)
                                        };
                                        request(options1, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("Inbound Successfully Run");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                    }
                                    else
                                    {
                                        var options = {
                                            'method': 'put',
                                            'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(newschedulesetting)

                                        };
                                        request(options, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("update schedule setting date");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                        var historyobj = {
                                            "project_id":newschedulesetting.project_id,
                                            "status":"fail"
                                        }
                                        var options1 ={
                                            'method': 'post',
                                            'url': config.domain + '/inbound_history/save/',
                                            'headers': {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(historyobj)
                                        };
                                        request(options1, function (error, response) {
                                            //console.log(response);
                                            if (error) throw new Error(error)
                                            else {

                                                //console.log(response);
                                                console.log("Inbound Successfully Run");
                                                //console.log(newschedulesetting);
                                            }
                                            //scheduelerunning++
                                            //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                        });
                                    }


                                    //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                });
                                //console.log("inbound run");
                            }
                            else {
                                console.log('Project Not Found');
                                //res.json({'status':'false','msg':'Connection Time Out Please Try Again'});
                            }
                        } catch (err) {
                            console.log('catch' + err);
                            //res.json({'status':'false','msg':'FTP Not Connected'});
                        }
                    }
                });
            }
            if (typeof list_arr_outbound !== 'undefined' && list_arr_outbound.length > 0) {
                // the array is defined and has at least one element
                
                list_arr_outbound.forEach(item => {
                    var start_flag_outbound = "true";

                    
                    if (start_flag_outbound == "true") {

                        console.log("time match outbound");
                        console.log("outbound run for project :" + item.outbound_setting.project_id);
                        var project_id = item.outbound_setting.project_id;
                        var project_code = item.ProjectCode;
                        var newschedulesetting = item.schedule_setting;
                        // console.log(client.clientList());
                        var options = {
                            'method': 'POST',
                            'url': config.domain + '/inbound/outboundrun',
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "project_id": project_id,
                                "project_code":project_code
                            })
                        }
                        request(options, function (error, response) {
                            if (error) {
                                console.log(error);
                                //throw new Error(error);
                            }
                            else {
                                var result = JSON.parse(response.body);

                                if (result.Status != undefined && result.Status == 1) {
                                    
                                    //var date = new Date();
                                    //newschedulesetting.next_date_inbound = date;
                                    //console.log(newschedulesetting);
                                    var options = {
                                        'method': 'put',
                                        'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newschedulesetting)

                                    };
                                    request(options, function (error, response) {
                                        //console.log(response);
                                        if (error) {
                                            console.log("update schedule setting error");
                                        }
                                        else {


                                            console.log("update schedule setting date");
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });

                                    var historyobj = {
                                        "project_id":newschedulesetting.project_id,
                                        "status":"success"
                                    }
                                    var options1 ={
                                        'method': 'post',
                                        'url': config.domain + '/outbound_history/save/',
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(historyobj)
                                    };
                                    request(options1, function (error, response) {
                                        //console.log(response);
                                        if (error) throw new Error(error)
                                        else {

                                            //console.log(response);
                                            console.log("outbound Successfully Run");
                                            //console.log(newschedulesetting);
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });
                                }
                                else
                                {
                                    var options = {
                                        'method': 'put',
                                        'url': config.domain + '/schedule_setting/update/' + item.schedule_setting._id,
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newschedulesetting)

                                    };
                                    request(options, function (error, response) {
                                        //console.log(response);
                                        if (error) {
                                            console.log("update schedule setting error");
                                        }
                                        else {


                                            console.log("update schedule setting date");
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });
                                    var historyobj = {
                                        "project_id":newschedulesetting.project_id,
                                        "status":"fail"
                                    }
                                    var options1 ={
                                        'method': 'post',
                                        'url': config.domain + '/outbound_history/save/',
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(historyobj)
                                    };
                                    request(options1, function (error, response) {
                                        //console.log(response);
                                        if (error) throw new Error(error)
                                        else {

                                            //console.log(response);
                                            console.log("Outbound Run Failed");
                                            //console.log(newschedulesetting);
                                        }
                                        //scheduelerunning++
                                        //res.json({'status':'true','msg':'Inbound Run Successfully'});
                                    });
                                }

                            }
                        })
                    }
                    else {
                        console.log("schedule start date and end date not match");
                    }

                });
            }
        }
    })
});

module.exports = router;
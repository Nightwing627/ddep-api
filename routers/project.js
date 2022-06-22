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

const Item = require('../models/item.model.js')
const Project = require('../models/project.model.js');
const InboundSetting = require('../models/inbound_setting.model.js');
const OutboundSetting = require('../models/outbound_setting.model.js');
const ScheduleSetting = require('../models/schedule_setting.model.js');

const ase = require('../my_modules/aes');
const { json } = require('body-parser');
router.post('/save', projects.create);
router.get('/item/detail/:id', async function(req,res){
    let id = req.params.id;
    let items = await fulllistItem();
    let item = items.filter(item => {
        return item._id == id;
    })

    res.status(200).json({
        "data": item
    })

    // res.status(200).json({
        
    //     "data": 
    //     {
    //     "item_ID": "62592d715c4b8a9d970b56ac",
    //     "pj_ID": "62592d4a5c4b8a9d970b56aa",
    //     "projectCode": "RAB Care Label Portal",
    //     "projectName": "Boden",
    //     "companyName": "RAB Care Label Portal",
    //     "isActive": "1",
    //     "createdAt": "2022-04-15T08:31:06.196Z",
    //     "updatedAt": "2022-05-19T06:42:06.239Z",
    //     "__v": 0,
    //     "inbound_setting": {
    //     "_id": "62592d715c4b8a9d970b56ac",
    //     "pj_id": "62592d4a5c4b8a9d970b56aa",
    //     "inbound_format": "xml",
    //     "sync_type": "FTP",
    //     "ftp_server_link": "ftp.1-label.com",
    //     "port": "21",
    //     "login_name": "1labeledi",
    //     "password": "LD88355",
    //     "folder": "/Home/Predeploy site/RAB Care Label Portal",
    //     "is_password_encrypted": "yes",
    //     "is_active": "Active",
    //     "createdAt": "2022-04-15T08:31:45.325Z",
    //     "updatedAt": "2022-05-19T06:44:46.838Z",
    //     "__v": 0,
    //     "api_ddep_api": "",
    //     "api_type": "User_API",
    //     "api_user_api": "",
    //     "ftp_backup_folder": "",
    //     "ftp_folder": "/Home/Predeploy site/RAB Care Label Portal",
    //     "ftp_login_name": "1labeledi",
    //     "ftp_password": "LD88355",
    //     "ftp_port": "21",
    //     "updateBy": "Divyesh"
    //     },
    //     "outbound_setting": {
    //     "_id": "626a37d9b1ca027fb56f2ba3",
    //     "pj_id": "62592d4a5c4b8a9d970b56aa",
    //     "outbound_format": "json",
    //     "sync_type_out": "API",
    //     "api_url": "https://portalpredeployadmin.1-label.com/API/TUUEdi/TuuImportApi.aspx",
    //     "is_active": "Active",
    //     "createdAt": "2022-04-28T06:44:41.317Z",
    //     "updatedAt": "2022-05-06T04:19:00.567Z",
    //     "__v": 0
    //     },
    //     "schedule_setting": {
    //     "_id": "626a37dcb1ca027fb56f2ba7",
    //     "pj_id": "62592d4a5c4b8a9d970b56aa",
    //     "Schedule_configure_inbound": "schedule",
    //     "schedule_type_inbound": "Recurring",
    //     "Schedule_configure_outbound": "schedule",
    //     "schedule_type_outbound": "Recurring",
    //     "occurs_inbound": "daily",
    //     "occurs_outbound": "daily",
    //     "day_frequency_inbound_count": "1",
    //     "day_frequency_outbound_count": "1",
    //     "weekly_frequency_inbound_count": "1",
    //     "weekly_frequency_outbound_count": "1",
    //     "monthly_frequency_day_inbound": "1",
    //     "monthly_frequency_day_inbound_count": "1",
    //     "monthly_frequency_the_inbound_count": "1",
    //     "monthly_frequency_day_outbound": "1",
    //     "monthly_frequency_day_outbound_count": "1",
    //     "monthly_frequency_the_outbound_count": "1",
    //     "daily_frequency_type_inbound": "Occurs Once At",
    //     "daily_frequency_type_outbound": "Occurs Once At",
    //     "daily_frequency_once_time_inbound": "",
    //     "daily_frequency_every_time_unit_inbound": "hour",
    //     "daily_frequency_every_time_count_inbound": "1",
    //     "daily_frequency_every_time_count_start_inbound": "",
    //     "daily_frequency_every_time_count_end_inbound": "",
    //     "daily_frequency_every_time_count_start_outbound": "",
    //     "daily_frequency_every_time_count_end_outbound": "",
    //     "daily_frequency_once_time_outbound": "",
    //     "daily_frequency_every_time_unit_outbound": "hour",
    //     "daily_frequency_every_time_count_outbound": "1",
    //     "occurs_weekly_fields_inbound": [
    //     ""
    //     ],
    //     "monthly_field_setting_inbound": [
    //     ""
    //     ],
    //     "recurs_count_outbound": "",
    //     "recurs_time_outbound": "",
    //     "occurs_weekly_fields_outbound": [
    //     ""
    //     ],
    //     "monthly_field_setting_outbound": [
    //     ""
    //     ],
    //     "next_date_inbound": "Thu Apr 28 2022 08:00:00 GMT+0800 ()",
    //     "next_date_outbound": "Invalid Date",
    //     "duration_inbound_start_date": "2022-04-28",
    //     "duration_inbound_is_end_date": "no_end_date",
    //     "duration_inbound_end_date": "",
    //     "duration_outbound_start_date": "",
    //     "duration_outbound_is_end_date": "no_end_date",
    //     "duration_outbound_end_date": "",
    //     "createdAt": "2022-04-28T06:44:44.313Z",
    //     "updatedAt": "2022-04-28T06:44:44.313Z",
    //     "__v": 0
    //     },
    //     "inbound_history": [],
    //     "outbound_history": []
    //     }

    // });
})
router.get('/item/fulllist',projects.fullProject);
router.get('/fulllist', async function(req,res){
    let items = await fulllistItem();
    // let projects = await fulllistProject();

    // let result = projects.map((project, index) => {
    //     let itemArray = items.filter((item, index) => {
    //         return project._id == item.ProjectId
    //     }).map((item, index) => {
    //         let data = {
    //             "item_ID": item._id,
    //             "itemCode": item.ItemCode,
    //             "itemName": item.ItemName,
    //             "itemDescr": item.CompanyName,
    //             "isActive": item.isActive,
    //             "version": item.__v,
    //             "inboundType": item.inbound_setting.api_type,
    //             "inboundFormat": item.inbound_setting.inbound_format,
    //             "outboundFormat": item.outbound_setting.outbound_format,
    //             "scheduleDescr": item.schedule_setting.occurs_inbound
    //         }
    //         return data;
    //     })

    //     return {
    //         "pj_ID": project._id,
    //         "projectCode": project.ProjectCode,
    //         "projectName": project.ProjectName,
    //         "projectDescr": project.ProjectDescr,
    //         "group": "",
    //         "isActive": project.isActive,
    //         "createdAt": project.createdAt,
    //         "updatedAt": project.updatedAt,
    //         "items": itemArray
    //     }
    // })

    // console.log(result)
    // res.status(200).json({
    //     "data": result
    // })

    // let productItem = items.map((item, index) => {
    //     let data = {
    //         "item_ID": item._id,
    //         "itemCode": item.ItemCode,
    //         "itemName": item.ItemName,
    //         "itemDescr": item.CompanyName,
    //         "isActive": item.isActive,
    //         "version": item.__v,
    //         "inboundType": item.inbound_setting.api_type,
    //         "inboundFormat": item.inbound_setting.inbound_format,
    //         "outboundFormat": item.outbound_setting.outbound_format,
    //         "scheduleDescr": item.schedule_setting.occurs_inbound
    //     }
    //     return data;
    // })
    res.status(200).json({
        "data": [
            {
            "pj_ID": "62592d4a5c4b8a9d970b56aa",
            "projectCode": "iRMS-External-Exchange",
            "projectName": "i-RMS External Exchange Data",
            "projectDescr": "all External Parties requested integrate data will be added in here",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z",
            "items": [
                {
                "item_ID": "62592d715c4b8a9d970b56a1",
                "itemCode": "BGRS-Initiations-Synchronize",
                "itemName": "BGRS Initiations Synchronize",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                },
                {
                "item_ID": "62592d715c4b8a9d970b5634",
                "itemCode": "BGRS-Initiations",
                "itemName": "BGRS Initiations",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                }]
            },
            {
            "pj_ID": "62592d4a5c4b8a9d970b56ab",
            "projectCode": "iRMS-Exchange",
            "projectName": "i-RMS External Exchange Data",
            "projectDescr": "all External Parties requested integrate data will be added in here",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z",
            "items": [
                {
                "item_ID": "62592d715c4b8a9d970b56a1",
                "itemCode": "BGRS-Initiations-Synchronize",
                "itemName": "BGRS Initiations Synchronize",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                },
                {
                "item_ID": "62592d715c4b8a9d970b5634",
                "itemCode": "BGRS-Initiations",
                "itemName": "BGRS Initiations",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                }]
            },
            {
            "pj_ID": "62592d4a5c4b8a9d970b56ac",
            "projectCode": "iRMS-External",
            "projectName": "i-RMS External Exchange Data",
            "projectDescr": "all External Parties requested integrate data will be added in here",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z",
            "items": [
                {
                "item_ID": "62592d715c4b8a9d970b56a1",
                "itemCode": "BGRS-Initiations-Synchronize",
                "itemName": "BGRS Initiations Synchronize",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                },
                {
                "item_ID": "62592d715c4b8a9d970b5634",
                "itemCode": "BGRS-Initiations",
                "itemName": "BGRS Initiations",
                "itemDescr": "BGRS will share their business to multiple parties",
                "isActive": "1",
                "version": "1.7",
                "inboundType": "DDEP API",
                "inboundFormat": "JSON",
                "outboundFormat": "JSON",
                "scheduleDescr": "Daily 18:00"
                }]
            },
        ]
    })
})
router.post('/add',function(req,res){
    var ProjectCode = req.body.projectCode;
    var ProjectName = req.body.projectName;
    var ProjectDescription = req.body.projectDescr;
    //var Sequence = req.body.Sequence;
    var Group = req.body.group;
    var isActive = req.body.isActive;
    res.status(200).json({
            'data': [{
                "pj_ID": "62592d4a5c4b8a9d970b56aa",
                "projectCode": ProjectCode,
                "projectName": ProjectName,
                "projectDescr": ProjectDescription,
                "group":"",
                "isActive": "1",
                "createdAt": "2022-04-15T08:31:06.196Z",
                "updatedAt": "2022-05-19T06:42:06.239Z"
            }]
        }
    );
    
})
router.post('/update/:id',function(req,res){
    var ProjectCode = req.body.projectCode;
    var ProjectName = req.body.projectName;
    var ProjectDescription = req.body.projectDescr;
    //var Sequence = req.body.Sequence;
    var Group = req.body.group;
    var isActive = req.body.isActive;
    res.status(200).json({
            'data': [{
                "pj_ID": "62592d4a5c4b8a9d970b56aa",
                "projectCode": ProjectCode,
                "projectName": ProjectName,
                "projectDescr": ProjectDescription,
                "group":"",
                "isActive": "1",
                "createdAt": "2022-04-15T08:31:06.196Z",
                "updatedAt": "2022-05-19T06:42:06.239Z"
            }]
        }
    );
    
})
router.get('/detail/:id',function(req,res){
    res.status(200).json({
        'data': {
            "pj_ID": "62592d4a5c4b8a9d970b56aa",
            "projectCode": "test",
            "projectName": "test",
            "projectDescr": "test",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z"
        }
    }
);
})
router.get('/list',function(req,res){
    res.status(200).json({
        "data": [{
            "pj_ID": "62592d4a5c4b8a9d970b56aa",
            "projectCode": "iRMS-External-Exchange",
            "projectName": "i-RMS External Exchange Data",
            "projectDescr": "all External Parties requested integrate data will be added in here",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z"
            }] 
    })
})

const fulllistProject = async () => {
    let data;
    await Item.find()
    .then(projects => {
        data = projects
    }).catch(err => {
        data = "error";
    });
    return data;
}

const fulllistItem = async () => {
    let items;
    await Project.aggregate([
        {
        $lookup: {
            from: "inboundsettings", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "item_id",//field from the documents of the "from" collection
            as: "inbound_setting"// output array field
        },
        
    },
    
    {
        $lookup: {
            from: "outboundsettings", // from collection name
            localField: "_id",
            foreignField: "item_id",
            as: "outbound_setting"
        }
    },
    {
        $lookup: {
            from: "schedulesettings", // from collection name
            localField: "_id",
            foreignField: "item_id",
            as: "schedule_setting"
        }
    },
    { "$lookup": {
        "from": "inboundhistories",
        "localField": "_id",
        "foreignField": "item_id",
        "as": "inbound_history"
      }},
      { "$addFields": {
        "inbound_history": { "$slice": ["$inbound_history", -1] }
      }},
    { "$lookup": {
        "from": "outboundhistories",
        "localField": "_id",
        "foreignField": "item_id",
        "as": "outbound_history"
      }},
      { "$addFields": {
        "outbound_history": { "$slice": ["$outbound_history", -1] }
      }},
    {
        $unwind:{
            path: "$inbound_setting",
            preserveNullAndEmptyArrays: true
          },
    },
    {
        $unwind:{
            path: "$outbound_setting",
            preserveNullAndEmptyArrays: true
          },
    },
    {
        $unwind:{
            path: "$schedule_setting",
            preserveNullAndEmptyArrays: true
          },
    }
    ],function (error, data) {
        items = data;
        //handle error case also
      }
    );
    return items;
  };

module.exports = router;
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
router.get('/item/fulllist',function(req,res){
    res.status(200).json({"data": [{
        "pj_ID": "62592d4a5c4b8a9d970b56aa",
        "projectCode": "iRMS-External-Exchange",
        "projectName": "i-RMS External Exchange Data",
        "projectDescr": "all External Parties requested integrate data will be added in here",
        "group":"",
        "isActive": "1",
        "createdAt": "2022-04-15T08:31:06.196Z",
        "updatedAt": "2022-05-19T06:42:06.239Z",
        "items": [{
        "item_ID": "62592d715c4b8a9d970b56ac",
        "itemCode": "BGRS-Initiations-Synchronize",
        "itemName": "BGRS Initiations Synchronize",
        "itemDescr": "BGRS will share their business to multiple parties",
        "isActive": "1",
        "version": "1.7",
        "inboundType": "DDEP API",
        "inboundFormat": "JSON",
        "outboundFormat": "JSON",
        "scheduleDescr": "Daily 18:00"
        
        }]
        }]});
})
router.post('/item/add',function(req,res){
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
router.post('/item/update/:id',function(req,res){
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
router.get('/item/detail/:id',function(req,res){
    res.status(200).json({
        'data': [{
            "pj_ID": "62592d4a5c4b8a9d970b56aa",
            "projectCode": "test",
            "projectName": "test",
            "projectDescr": "test",
            "group":"",
            "isActive": "1",
            "createdAt": "2022-04-15T08:31:06.196Z",
            "updatedAt": "2022-05-19T06:42:06.239Z"
        }]
    }
);
})



module.exports = router;
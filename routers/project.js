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

const projectController = require('../controllers/projects.controller.js');
const itemController = require('../controllers/item.controller.js')

const ase = require('../my_modules/aes');
const { json } = require('body-parser');
router.post('/save', projects.create);

router.post('/item/create', async (req, res) => {
    console.log(req.body)
    const result = await itemController.create(req.body)
    res.status(200).json(result)
})

router.post('/item/add', (req, res) => {
    console.log(req.body.type)
    let data;
    switch (req.body.type) {
        case "item" :
            request.post(config.domain+'/project/item/create', {form:req.body}, function (error, response, body) {
            // request.post('http://localhost:8014/project/item/create', {form:req.body}, function (error, response, body) {
                data = JSON.parse(body);
                res.status(200).json(data)
            })
            break;
        case "inbound":
            data = req.body;
            data = { ...data, project_id: data.item_id };
            console.log(data)
            request.post(config.domain+'/inbound_setting/save', {form:req.body}, function (error, response, body) {
            // request.post('http://localhost:8014/inbound_setting/save', {form:data}, function (error, response, body) {
                var data = JSON.parse(body);
                res.status(200).json(data)
            })
            break;
        case "outbound":
            data = req.body;
            data = { ...data, project_id: data.item_id };
            console.log(data)
            request.post(config.domain+'/inbound_setting/save', {form:req.body}, function (error, response, body) {
            // request.post('http://localhost:8014/outbound_setting/save', {form:data}, function (error, response, body) {
                var data = JSON.parse(body);
                res.status(200).json(data)
            })
            break;
        case "schedule":
            data = req.body;
            data = { ...data, project_id: data.item_id };
            console.log(data)
            request.post(config.domain+'/inbound_setting/save', {form:req.body}, function (error, response, body) {
            // request.post('http://localhost:8014/schedule_setting/save', {form:data}, function (error, response, body) {
                var data = JSON.parse(body);
                res.status(200).json(data)
            })
            break;
        default :
    }
})

router.get('/item/detail/:id', async function(req,res){
    let id = req.params.id;
    let items = await itemController.fulllistItem();
    let itemData = items.filter(item => {
        return item._id == id;
    })

    let projectData = await projectController.findOne(itemData[0].ProjectId);
    let inbound = itemData[0].inbound_setting;
    let outbound = itemData[0].outbound_setting;
    let schedule = itemData[0].schedule_setting;

    inbound = {...inbound, "pj_id" : projectData._id}
    outbound = {...outbound, "pj_id" : projectData._id}
    schedule = {...schedule, "pj_id" : projectData._id}

    res.status(200).json({
        "data": 
        {
        "item_ID": itemData[0]._id,
        "pj_ID": itemData[0].ProjectId,
        "projectCode": projectData.ProjectCode,
        "projectName": projectData.ProjectName,
        "companyName": projectData.CompanyName,
        "isActive": projectData.isActive,
        "createdAt": projectData.createdAt,
        "updatedAt": projectData.updatedAt,
        "__v": itemData[0].__v,
        "inbound_setting": inbound,
        "outbound_setting": outbound,
        "schedule_setting": schedule,
        "inbound_history": [],
        "outbound_history": []
        }
    });
})

router.get('/item/fulllist',projects.fullProject);
router.get('/fulllist', async function(req,res){
    let items = await itemController.fulllistItem();
    let projects = await projectController.fulllistProject();
    let result = projects.map((project, index) => {
        let itemArray = items.filter((item, index) => {
            return project._id == item.ProjectId
        }).map((item, index) => {
            try {
            let data = {
                "item_ID": item._id,
                "itemCode": item.ItemCode,
                "itemName": item.ItemName,
                "itemDescr": item.CompanyName,
                "isActive": item.isActive,
                "version": item.__v,
                "inboundType": item.inbound_setting.api_type,
                "inboundFormat": item.inbound_setting.inbound_format,
                "outboundFormat": item.outbound_setting.outbound_format,
                "scheduleDescr": item.schedule_setting.occurs_inbound
            }
            return data;
        } catch {}
        })

        return {
            "pj_ID": project._id,
            "projectCode": project.ProjectCode,
            "projectName": project.ProjectName,
            "projectDescr": project.CompanyName,
            "group": "",
            "isActive": project.isActive,
            "createdAt": project.createdAt,
            "updatedAt": project.updatedAt,
            "items": itemArray
        }
    })

    res.status(200).json({
        "data": result
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


module.exports = router;
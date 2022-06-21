var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const crypto = require('crypto');
const { transform, prettyPrint } = require('../node_modules/camaro');
const t = require('tape');
var xmldom = require('xmldom');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var xpath = require('xpath');
const ftp = require("basic-ftp");
const utf8 = require('utf8');

var Client = require('ftp');
const config = require('../config/default');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const inbound = require('../controllers/inbound.controller.js');
const { log, time } = require('console');
const { json } = require('body-parser');
const { XMLParser } = require('fast-xml-parser');
const { exit } = require('process');
router.post('/run', inbound.create);
router.post('/findbyproject_id',inbound.findByProjectId);
router.put('/:id',inbound.update);
var logdate = new Date();
var keywordsinbound = "";
var prelog = "["+ logdate +"] - [/routers/inbound.js] > [/inboundrun] > [keywords] >";
var keywordoutbound = "";
var prelogoutbound = "["+ logdate +"] - [/routers/inbound.js] > [/outboundrun] > [keywords] >";
    var logdatefilename = 'log_'+logdate.getDate()+'_'+parseInt(logdate.getMonth()+1)+'_'+logdate.getFullYear()+'.txt';
    var logdir = './output/log/';
    if (!fs.existsSync(logdir)){
        fs.mkdirSync(logdir, { recursive: true });
    }
    function writelog(file,string)
    {

      fs.appendFile(file, string, (err) => {
          if (err) {
          console.log(err);
          }
          else {
          
          }
      });
    } 
router.post('/ftpconnectiontest',function(req,res){
 var id = req.body.project_id;
  var options = {
    'method': 'POST',
    'url': config.domain+'/inbound/run',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "project_code": "001",
      "project_id": "616ecacb5593bb6f186bb05c",
      "inbound_data": {
        "POHeader": {
          "OrderHandeling": [
            {
              "OH_ID": "ImportAs",
              "OH_Data": "Complete"
            },
            {
              "OH_ID": "LastUpdateDate",
              "OH_Data": "20210305"
            },
            {
              "OH_ID": "SizeChartModel",
              "OH_Data": "Generic"
            },
            {
              "OH_ID": "AdjustWastage",
              "OH_Data": "False"
            }
          ],
          "CustRef": {
            "Variable": {
              "CR_ID": "PO",
              "CR_Data": "213506"
            }
          },
          "SupplierDetail": {
            "SupplierNo": "9999",
            "FactoryNo": []
          },
          "ItemRefs": {}
        },
        "EDIHeader": {
          "EDI_Variables": [
            {
              "EDI_HName": "PO",
              "EDI_HValue": "213506"
            },
            {
              "EDI_HName": "Season",
              "EDI_HValue": "204"
            },
            {
              "EDI_HName": "ARTIKEL",
              "EDI_HValue": "36335090"
            },
            {
              "EDI_HName": "Color",
              "EDI_HValue": "818"
            },
            {
              "EDI_HName": "Component",
              "EDI_HValue": []
            },
            {
              "EDI_HName": "Color",
              "EDI_HValue": "818"
            },
            {
              "EDI_HName": "Country-of-Origin-1",
              "EDI_HValue": "CHINA"
            }
          ],
          "EDI_CareandContent": {
            "Fibre": [
              {
                "FibreComponentName": "SHELL FABRIC 1",
                "Variable": [
                  {
                    "FibreName": "POLYAMIDE",
                    "FibrePercent": "50"
                  },
                  {
                    "FibreName": "abaca",
                    "FibrePercent": "50"
                  }
                ]
              },
              {
                "FibreComponentName": "LINING 1",
                "Variable": {
                  "FibreName": "POLYAMIDE",
                  "FibrePercent": "100"
                }
              },
              {
                "FibreComponentName": "PADDING 1",
                "Variable": {
                  "FibreName": "DUCK DOWN",
                  "FibrePercent": "100"
                }
              },
              {
                "FibreComponentName": [],
                "Variable": {
                  "FibreName": "CONTAINS NON-TEXTILE PARTS OF ANIMAL ORIGIN",
                  "FibrePercent": []
                }
              }
            ],
            "FrabricStatments": [
              {
                "Statment": "USE MILD DETERGENTS DO NOT USE FABRIC SOFTENER"
              },
              {
                "Statment": "DO NOT KEEP IN MOIST CONDITION"
              },
              {
                "Statment": "DO NOT IRON PRINT"
              }
            ],
            "CareSymbolMappingID": [
              {
                "CareMappingID": "e"
              },
              {
                "CareMappingID": "o"
              },
              {
                "CareMappingID": "s"
              },
              {
                "CareMappingID": "n"
              },
              {
                "CareMappingID": "U"
              },
              {
                "CareMappingID": "A"
              },
              {
                "CareMappingID": []
              },
              {
                "CareMappingID": []
              },
              {
                "CareMappingID": []
              },
              {
                "CareMappingID": []
              }
            ]
          }
        },
        "EDISizeDetail": {
          "EDI_Size": {
            "SizeChartID": [],
            "EDIPrimarySize": "8",
            "Variable": {
              "TicketQuantity": "20"
            },
            "MatrixDetail": [
              {
                "EDISizeDetail_Name": "Unisex",
                "EDISizeDetail_Value": "M"
              },
              {
                "EDISizeDetail_Name": "Size",
                "EDISizeDetail_Value": "38"
              }
            ]
          }
        }
      }
    })
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  res.send(response);
});
  var host = "ftp1.innoways.com";
  var user = "zennaxx";
  var password = "k59*7cmR";
  var port = 21;
  var is_secure = true;
  var setting ={};
  setting.host = host;
  setting.user = user;
  setting.password = password;
  setting.port = port;
  setting.secure = is_secure;
  
var ftp = new Client()
        
    var filelist = [];
    ftp.connect(setting);

      ftp.on('ready', function() {
      ftp.list('home/TUU_XML',function(err, list) {
      if (err){
          throw err;
      } 
      for (let index = 0; index < list.length; index++) {
          if((list[index].type!=="d")){
              filelist.push(list[index].name);
          }
          
      }
        res.json({"status":1,"msg":"run successfully","data":filelist});
      });
        
    })
});
router.post('/inboundrun',function(req,res){
  //console.log(req.body.project_id);
  var prelogtest = prelog.replace("keywords","startinbound");
  writelog(logdir+logdatefilename,prelogtest+" " +req.body.project_id+"\n");
  var project_id = req.body.project_id;
  var options = {
    method:"GET",
    url:"inbound_setting/editAPI/"+req.body.project_id
  }
  //writelog(logdir+logdatefilename,"\n Getting Details of inbound setting of project :"+req.body.porject_id+"\n");
  request(config.domain+'/'+options.url, function (error, response, body){
    if(error)
    {
      console.log(error);
      //writelog(logdir+logdatefilename,"\n Error in inbound setting get detail : \n"+error+"\n");
      var prelogtest = prelog.replace("keywords","not defined");
      writelog(logdir+logdatefilename,+prelogtest+" Project Id >"+project_id+ "Error:"+ error+"\n");
      return res.json({"Status":0,"Msg":"Invalid Method"});
    }
    var inboundSetting = JSON.parse(body);

    if (inboundSetting.sync_type == 'FTP' || inboundSetting.sync_type == 'SFTP') {
      var secure = false;
      if(inboundSetting.is_password_encrypted=="yes")
      {
        secure = true;
      }
      var settings = {
        host:inboundSetting.ftp_server_link ,
        user:inboundSetting.login_name,
        password:inboundSetting.password,
        port:inboundSetting.port,
        secure:false,
        connTimeout:200000,
        pasvTimeout :200000,
        keepalive :200000 
      }
      var folderpath = inboundSetting.folder;
      var backup_folder = inboundSetting.backup_folder
      if(backup_folder=='' || backup_folder==undefined)
      {
        backup_folder='backup';
      }
      var date = new Date();
      var dir = './output/inbounds';
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      else
      {
        console.log("folder found");
      }
      var projectdir = inboundSetting.project_id;
      if(!fs.existsSync(dir+'/'+projectdir)){
        fs.mkdirSync(dir+'/'+projectdir);
      }
      var ftp = new Client()
      try{
        var prelogtest = prelog.replace("keywords","not defined");
        writelog(logdir+logdatefilename,prelogtest+" Project Id > "+inboundSetting.project_id+ " Below FTP Details Found in this project:"+"\n");
        writelog(logdir+logdatefilename,prelogtest+" connecting FTP with below detail\n");
        writelog(logdir+logdatefilename,prelogtest+" host : "+settings.host+"\n");
        writelog(logdir+logdatefilename,prelogtest+" username : "+settings.user+"\n");
        writelog(logdir+logdatefilename,prelogtest+" folder path : "+folderpath+"\n");
        var prelogtest = prelog.replace("keywords","ftpconnected");
        writelog(logdir+logdatefilename,prelogtest+" Connecting with FTP..."+"\n");
        var filescounter=0;
                var filefailcounter =0;
                var filedownloadcounter=0;
          ftp.on('ready', function() {
            ftp.mkdir(folderpath+'/'+backup_folder,function(err){
              if(err)
              {
                //console.log(folderpath+'/'+backup_folder);
                //console.log(err);
                console.log("backup folder not created");
                var prelogtest = prelog.replace("keywords","not defined");
                //writelog(logdir+logdatefilename,"\n backup folder exists name : "+backup_folder+"\n");
                writelog(logdir+logdatefilename,prelogtest+" Project Id > "+inboundSetting.project_id+ " Backup folder found in FTP:"+"\n");
              }
              else
              {
                var prelogtest = prelog.replace("keywords","not defined");
                console.log("backup folder created");
                writelog(logdir+logdatefilename,prelogtest+" Project Id > "+inboundSetting.project_id+ " Backup folder Created in FTP:"+"\n");

              }
            })
            ftp.list(folderpath,function(err, list) {
              if (err){
                console.log(err);
                //writelog(logdir+logdatefilename,"\n Files not Found in folder path"+ "\n");
                var prelogtest = prelog.replace("keywords","not defined");
                writelog(logdir+logdatefilename,prelogtest+" Project Id > "+inboundSetting.project_id+ "Files not Found in folder path:"+"\n");

                return res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
              } 
              else
              {
                //console.log(list.length);
                //console.log(list);
                
                if(list.length <= 0)
                {
                  //writelog(logdir+logdatefilename,"\n Files not Found in folder path"+ "\n");
                  var prelogtest = prelog.replace("keywords","not defined");
                  writelog(logdir+logdatefilename,prelogtest+" Project Id > "+inboundSetting.project_id+ "Files not Found in folder path:"+"\n");
                  return res.json({"Status":0,Msg:"Files Not Found !",Data:[]})
                }
                for (let index = 0; index < list.length; index++) {
                  console.log(list[index]);
                  if((list[index].type!=="d")){
                    filescounter++;
                    console.log(list[index].name);
                    console.log("folder path found "+folderpath+'/'+list[index].name);
                    var content='';
                    ftp.get(folderpath+'/'+list[index].name, function(err, stream) {
                      var prelogtest = prelog.replace("keywords","ftpdownloading");
                      writelog(logdir+logdatefilename,prelogtest +"Downloading File :"+folderpath+'/'+list[index].name+ "\n");
                      if (err)
                      {
                        console.log("error in "+list[index].name);
                        var prelogtest = prelog.replace("keywords","ftpdownloading-error");
                        //writelog(logdir+logdatefilename,"\n Error in Download File :"+folderpath+'/'+list[index].name+ "\n");
                        writelog(logdir+logdatefilename,prelogtest+"Error in Download File :"+folderpath+'/'+list[index].name+ "\n");
                        writelog(logdir+logdatefilename,prelogtest+"\n Error : "+err+ "\n");
                      }
                      else
                      {
                        let date_ob = new Date();
                        let date = ("0" + date_ob.getDate()).slice(-2);
    
                        // current month
                        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
                        // current year
                        let year = date_ob.getFullYear();
    
                        // current hours
                        let hours = date_ob.getHours();
    
                        // current minutes
                        let minutes = date_ob.getMinutes();
    
                        // current seconds
                        let seconds = date_ob.getSeconds();
                        let milliseconds = date_ob.getMilliseconds();
                      
                        var name = list[index].name.split('.').slice(0, -1).join('.')+'_'+year+month+date+hours+minutes+seconds+milliseconds;//parseInt(crypto.randomBytes(2).toString('hex'), 16); //parseInt(date.getTime() + 1);
                        console.log(name);
                        stream.pipe(fs.createWriteStream(dir+'/'+projectdir+'/'+name+'.xml'));
                        
                        //var new_name = name+'_'+date+month+year+hours+minutes+seconds+'.xml'
                        var new_name = name+'.xml'
                        ftp.rename(folderpath+'/'+list[index].name,folderpath+'/'+backup_folder+'/'+new_name,function(err){
                          if(err)
                          {
                            console.log(err);
                            var prelogtest = prelog.replace("keywords","inboundfilebackup");
                            writelog(logdir+logdatefilename,prelogtest+" Error while move File to backup folder with name :"+folderpath+'/'+backup_folder+'/'+new_name+ "\n");
                            writelog(logdir+logdatefilename,prelogtest+" Error : "+err+"\n");
                          }
                          else
                          {
                            filedownloadcounter++;
                            var prelogtest = prelog.replace("keywords","downloadcompleted");
                            writelog(logdir+logdatefilename,prelogtest+" download Completed :"+folderpath+'/'+list[index].name+ "\n");
                            //var prelogtest = prelog.replace("keywords","inboundfilebackup");
                            var prelogtest = prelog.replace("keywords","movingtobackup");
                            writelog(logdir+logdatefilename,prelogtest+" File Move to backup folder with name :"+folderpath+'/'+backup_folder+'/'+new_name+ "\n");
                          }

                        })
                        
                      }
                      
                    });
                  }
                  if(index==list.length-1)
                  {
                    var prelogtest = prelog.replace("keywords","ftpdownloaded");
                    writelog(logdir+logdatefilename,prelogtest+"Total Files download Completed :"+filescounter+ "\n");
                    var prelogtest = prelog.replace("keywords","inboundfilebackup");
                    writelog(logdir+logdatefilename,prelogtest+"Total Files backup Completed :"+filescounter+ "\n");
                  }
                }
                if(filescounter==0)
                {
                  
                    console.log("files not found in FTP");
                    var prelogtest = prelog.replace("keywords","not defined");
                    writelog(logdir+logdatefilename,prelogtest+" Files not found connection close."+"\n");
                    ftp.end();
                    return res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
                    //return res.status(200).json({filetotal:filescounter,});
                }
                else
                {
                   
                  console.log("XML file Saved in inbound successfully");
                  // var prelogtest = prelog.replace("keywords","not defined");
                  // writelog(logdir+logdatefilename,prelogtest+" Files Saved Ftp connection close."+"\n");
                  // var prelogtest = prelog.replace("keywords","ftpdownloaded");
                  // writelog(logdir+logdatefilename,prelogtest+"Total Files download Completed :"+filedownloadcounter+ "\n");
                  // var prelogtest = prelog.replace("keywords","inboundfilebackup");
                  //   writelog(logdir+logdatefilename,prelogtest+"Total Files backup Completed :"+filedownloadcounter+ "\n");
                  ftp.end();
                  return res.json({Status:1,Msg:"Inbound File Saved",Data:[]});
                }
              } 
            });
          })
          ftp.connect(settings);
      }catch(err){
        console.log("connection time out error:"+err);
        var prelogtest = prelog.replace("keywords","not defined");
        writelog(logdir+logdatefilename,prelogtest+" connection time out error: "+err+"\n");
      }
    } else if (inboundSetting.sync_type == 'API') {
      if (inboundSetting.api_type == 'User_API') {
        var project_id = inboundSetting.project_id;
        var inbound_format = inboundSetting.inbound_format;
        var inbound_url = inboundSetting.api_user_api;
        request(inbound_url, function (error, response, inbody) {
          if(error) {
            res.json({
              code: "1",
              MsgCode: "50001",
              MsgType: "Invalid-Source",
              MsgLang: "en",
              ShortMsg: "Fail",
              LongMsg: error.message || "Some error occurred while getting the inbound setting.",
              InternalMsg: "",
              EnableAlert: "No",
              DisplayMsgBy: "LongMsg",
              Data: []
            });
          }
          if (inbound_format == 'json') {
            var object = JSON.parse(inbody);
            user_api(project_id, object, res);
            // return res.json(returnResult);
          } else {
            const template2 = ['//WebOrder',{
              OrderHandling:[
                '//POHeader/OrderHandling/Variable',
                {
                  ID:'ID',
                  Data:'Data'
                }
              ],
              CustRef:[
                '//POHeader/CustRef/Variable',
                {
                  ID:'ID',
                  Data:'Data'
                }
              ],
              SupplierDetail:['//POHeader/SupplierDetail/Variable',
                {
                  ID:'ID',
                  Data:'Data'
                }
              ],
              ItemRefs:[
                '//POHeader/ItemRefs/Variable',
                {
                  ID:'ID',
                  Data:'Data'
                }
              ],
              EDIHeader:{
                EDIVariables:['//EDIHeader/EDIVariables/Variable',{
                  ID:"ID",
                  Data:"Data"
                }],
                EDICareandContent:{
                  Fibres:{
                    FibreComponents_1:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[1]/Variable',{
                      ID:"ID",
                      Data:"Data"
                    }],
                    FibreComponents_2:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[2]/Variable',{
                      ID:"ID",
                      Data:"Data"
                    }],
                  },
                  FrabricStatments:['//EDIHeader/EDICareandContent/FrabricStatments/Variable',{
                    ID:'ID',
                    Data:'Data'
                  }],
                  CareSymbolMappingID:['//EDIHeader/EDICareandContent/CareSymbolMappingID/Variable',{
                    ID:'ID',
                    Data:'Data'
                  }]
                }
              },
              EDISizeDetail:{
                EDISize:['//EDISizeDetail/EDISize',{
                  Variable:['//EDISizeDetail/EDISize/Variable',{
                    ID:'ID',
                    Data:'Data'
                  }],
                  MatrixDetail:['//EDISizeDetail/EDISize/MatrixDetail/Variable',{
                    ID:'ID',
                    Data:'Data'
                  }]
                }]
              }
            }];

            var parser = new xmldom.DOMParser();
            var root = parser.parseFromString(inbody, 'text/xml');
            const result = '`'+inbody+'`';
            ;(async function () {
              try {
                const result = await transform(inbody, template2);
                var data = result;
                var nodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents', root);
                var counter = 1;
                var fibres = {};
                nodes.forEach(function(item, i) {
                  var fibrecomponents = '';

                  fibrecomponents = nodes[i].localName + "_" + counter;

                  var Variablenodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable', root);
                  var node_variable_counter = 1;
                  fibres[fibrecomponents] = [];
                  Variablenodes.forEach(function(item, j) {
                    var id = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter +']/ID', root);
                    var data = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter+']/Data', root);

                    fibres[fibrecomponents][j]={'ID':id[0].firstChild.data,'Data':data[0].firstChild.data};
                    node_variable_counter++;
                  })
                  counter++;
                });
                data[0].SupplierDetail.push({ID:"Brand",Data:"RAB Care Label Portal"});

                if (fibres.length > 0) {
                  data[0].EDIHeader.EDICareandContent.Fibres = fibres;
                }

                if((data[0].EDISizeDetail.EDISize.length == undefined  || data[0].EDISizeDetail.EDISize.length == 0) && (data[0].EDISizeDetail.MatrixDetail == undefined || data[0].EDISizeDetail.MatrixDetail.length == 0)) {
                  delete data[0].EDISizeDetail;
                }
                if((data[0].OrderHandeling == undefined || data[0].OrderHandeling.length == 0)) {
                  delete data[0].OrderHandeling;
                }
                if((data[0].ItemRefs == undefined || data[0].ItemRefs.length == 0)) {
                  delete data[0].ItemRefs;
                }
                if((data[0].CustRef == undefined || data[0].CustRef.length == 0)) {
                  delete data[0].CustRef;
                }
                if((data[0].SupplierDetail == undefined || data[0].SupplierDetail.length == 0)) {
                  delete data[0].SupplierDetail;
                }
                if(data[0].EDIHeader.EDICareandContent.Fibres == undefined || data[0].EDIHeader.EDICareandContent.Fibres.length == 0) {
                  delete data[0].EDIHeader.EDICareandContent.Fibres;
                }
                if(data[0].EDIHeader.EDICareandContent.FrabricStatments == undefined || data[0].EDIHeader.EDICareandContent.FrabricStatments.length == 0) {
                  delete data[0].EDIHeader.EDICareandContent.FrabricStatments;
                }
                if(data[0].EDIHeader.EDICareandContent.CareSymbolMappingID == undefined || data[0].EDIHeader.EDICareandContent.CareSymbolMappingID.length == 0) {
                  delete data[0].EDIHeader.EDICareandContent.CareSymbolMappingID;
                }
              } catch(err) {
                console.log(err);
              }
              user_api(project_id, data, res);
               /* console.log(returnResult);
              if (returnResult.code == 0) {
                return res.json({Status:1, Msg: "Project API Inbound Outbound Run Successful", Data:[]});
              } else {
                return res.json({Status:0, Msg: "Project API Inbound Outbound Run Fail!", Data:[]});
              }*/
              // return res.json(returnResult);
            })()
          }
        });
      } else {
        return res.json({
          code: "1",
          MsgCode: "50001",
          MsgType: "Invalid-Source",
          MsgLang: "en",
          ShortMsg: "Fail",
          LongMsg: "DDEP API not run inbound!",
          InternalMsg: "",
          EnableAlert: "No",
          DisplayMsgBy: "LongMsg",
          Data: []
        });
      }
    } else {
      return res.json({
        code: "1",
        MsgCode: "50001",
        MsgType: "Invalid-Source",
        MsgLang: "en",
        ShortMsg: "Fail",
        LongMsg: "Synchronize Configure type not valid.",
        InternalMsg: "",
        EnableAlert: "No",
        DisplayMsgBy: "LongMsg",
        Data: []
      });
    }
  });
    //this.responseText = JSON.stringify({status:1,data:body});
  //res.json({"status":1,Msg:"call",data:reso});
});
router.post('/outboundrun',function(req,res){
  var prelogoutboundtest = prelogoutbound.replace("keywords","startoutbound");
  writelog(logdir+logdatefilename,prelogoutboundtest+ " "+ req.body.project_id+"\n");
  var succes =0;
  console.log("convert XML to JSON start");
  //writelog(logdir+logdatefilename,"\n convert XML to JSON start: "+"\n");
  var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json");
  writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+req.body.project_id+ " convert XML to JSON start:"+"\n");
  var project_id = req.body.project_id;
  var project_code = req.body.project_code;
  console.log(project_id);
  var directoryPath= './output/inbounds/'+project_id;
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
        "${defaultValue}",
        1,
        number(not(text())) * string-length("${defaultValue}")
    )
    )`
  
  var options = {
    method:"GET",
    url:"outbound_setting/editAPI/"+project_id
  }
  var outboundsetting={};
  var api_url='';
  request(config.domain+'/'+options.url, function (error, response, body){
    if(error)
    {
      console.log(error);
      res.json({"Status":0,"Msg":"Invalid Method"});
    }
    outboundsetting = JSON.parse(body);
    console.log(outboundsetting);
    api_url = outboundsetting.api_url
    var parser = new xmldom.DOMParser();
    // make project/date wise folder
    var date = new Date();
    var dir = './output/history/inbounds';
    var out_dir ='./output/history/outbounds';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    if (!fs.existsSync(out_dir)){
      fs.mkdirSync(out_dir);
    }
    var projectdir = dir+'/'+project_id;
    if(!fs.existsSync(projectdir)){
      fs.mkdirSync(projectdir);
    }
    var out_projectdir = out_dir+'/'+project_id;
    if(!fs.existsSync(out_projectdir)){
      fs.mkdirSync(out_projectdir);
    }
    var yearfolder = projectdir+'/'+date.getFullYear();
    if(!fs.existsSync(yearfolder)){
      fs.mkdirSync(yearfolder);
    }
    var out_yearfolder = out_projectdir+'/'+date.getFullYear();
    if(!fs.existsSync(out_yearfolder)){
      fs.mkdirSync(out_yearfolder);
    }
    var month_folder = yearfolder+'/'+ parseInt(date.getMonth()+1);
    if(!fs.existsSync(month_folder)){
      fs.mkdirSync(month_folder);
    }
    var out_month_folder = out_yearfolder+'/'+ parseInt(date.getMonth()+1);
    if(!fs.existsSync(out_month_folder)){
      fs.mkdirSync(out_month_folder);
    }
    const template = ['//WebOrder',{
                                  OrderHandling:[
                                    '//POHeader/OrderHandling/Variable',
                                    {
                                      ID:'ID',
                                      Data:'Data'
                                    }
                                  ],
                                  CustRef:[
                                    '//POHeader/CustRef/Variable',
                                    {
                                      ID:'ID',
                                      Data:'Data'
                                    }
                                  ],
                                  SupplierDetail:['//POHeader/SupplierDetail/Variable',
                                    {
                                      ID:"ID",
                                      Data:"Data"
                                    }
                                  ],
                                  ItemRefs:[
                                    '//POHeader/ItemRefs/Variable',
                                    {
                                      ID:'ID',
                                      Data:'Data'
                                      
                                    }
                                  ],
                                  
                                  EDIHeader:{
                                    
                                      EDIVariables:['//EDIHeader/EDIVariables/Variable',{
                                        ID:"ID",
                                        Data:"Data"
                                      }],
                                      EDICareandContent:{
                                        Fibres:{

                                          FibreComponents:['//EDIHeader/EDICareandContent/Fibre/FibreComponents/Variable',{
                                            ID:"ID",
                                            Data:"Data"
                                          }],
                                          
                                        },
                                        FrabricStatments:['//EDIHeader/EDICareandContent/FrabricStatments/Variable',{
                                          ID:'ID',
                                          Data:'Data'
                                        }],
                                        CareSymbolMappingID:['//EDIHeader/EDICareandContent/CareSymbolMappingID/Variable',{
                                          ID:'ID',
                                          Data:'Data'
                                        }]
                                      }
                                    },
                                    EDISizeDetail:{
                                      EDISize:['//EDISizeDetail/EDISize',{

                                        Variable:['//EDISizeDetail/EDISize/Variable',{
                                          ID:'ID',
                                          Data:'Data'
                                        }],
                                        MatrixDetail:['//EDISizeDetail/EDISize/MatrixDetail/Variable',{
                                          ID:'ID',
                                          Data:'Data'
                                        }]
                                      }]
                                      
                                    }
                                
                                }]
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      } 
      console.log("Scan ./output/inbounds/"+project_id+" directory of project :"+project_id);
      var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
      writelog(logdir+logdatefilename,prelogoutboundtest+" Scan ./output/inbounds/"+project_id+" directory of project :"+project_id+ "\n");
      //listing all files using forEach
      if(files.length == 0)
      {
        var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
        writelog(logdir+logdatefilename,prelogoutboundtest+" No json file found in this project No outbound Run"+"\n");
        //return res.status(200).json({Status:0,Msg:"Outbound Not Run"});
      }
      else
      {
        //var prelogoutboundtest = prelogoutbound.replace("keywords","outboundURL");
        //writelog(logdir+logdatefilename,prelogoutboundtest +" Project Id > "+project_id+ " > Outbond API :" + api_url+"\n");

        files.forEach(function (file) {
          // Do whatever you want to do with the file
          //console.log(file); 
          try{
            
              const data = fs.readFileSync(directoryPath+'/'+file, {encoding:'utf8'});
              var xml_string = data.replace(/(\r\n|\n|\r|\t)/gm, "");
              xml_string = cleanString(xml_string);
              xml_string = removeSpaceFromXMLTag(xml_string);
              xml_string = xml_string.replace(/>\s*/g, '>');  // Replace "> " with ">"
              xml_string = xml_string.replace(/\s*</g, '<');  // Replace "< " with "<"
              //console.log(xml_string);
              const xml = '`'+xml_string.trim()+'`'; 
              var prelogoutboundtest = prelogoutbound.replace("keywords","converting2Json");
              writelog(logdir+logdatefilename,prelogoutboundtest+" Converting to Json File :"+directoryPath+'/'+file+"\n");
              ;(async function () {
                try{
                    //console.log(xml);
                  const result = await transform(xml, template)
                  
                  //console.log(result.length);
                  if(result.length == 0)
                  {
                    console.log("Josn not convrted ! may be file is currupted or non XML-utf8 format.");
                    var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json-error");
                    writelog(logdir+logdatefilename,prelogoutboundtest+" error in to Json File :"+directoryPath+'/'+file+"\n");
                  }
                  else{
                    var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json");
                    writelog(logdir+logdatefilename,prelogoutboundtest+" Convert to Json File :"+directoryPath+'/'+file+"\n");
                    var data = result;
                    //console.log(data);
                    if(data.length > 0)
                    {

                      try{
                         
                        var root = parser.parseFromString(xml_string.trim());
                        //console.log(root);
                            var nodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents', root);
                            //console.log(nodes);
                            var fibres={}
                            if(nodes.length > 1)
                            {
      
                              var counter=1;
                              
                              nodes.forEach(function(item,i){
                                var fibrecomponents='';
                                //console.log(counter);
                                if(i==0)
                                {
          
                                  var fibrecomponents =nodes[i].localName+ "_"+counter;
                                }
                                else
                                {
                                  var fibrecomponents =nodes[i].localName + "_"+counter;
                                }
                                var Variablenodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable', root);
                                //console.log(Variablenodes[1].localName + ": " + Variablenodes);
                                var node_variable_counter=1
                                fibres[fibrecomponents] = [];
                                Variablenodes.forEach(function(item,j){
                                  var id = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter +']/ID', root);
                                  var data1 = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter+']/Data', root);
                                  
                                  fibres[fibrecomponents][j]={'ID':id[0].firstChild.data,'Data':data1[0].firstChild.data};
                                  node_variable_counter++;
                                  
                                })
                                counter++; 
                                //console.log(Variablenodes.firstChile);
                              });
                              //console.log(fibres);
                              
                              //writelog(logdir+logdatefilename,prelogoutbound+"Json Converted successfully:\n" + JSON.stringify(data)+"\n");
                              data[0].EDIHeader.EDICareandContent.Fibres = fibres;
                              
                              
                            }
                           
                              data[0].SupplierDetail.push({ID:"Brand",Data:project_code});
                              
                              if((data[0].EDISizeDetail.EDISize.length ==undefined  || data[0].EDISizeDetail.EDISize.length ==0) && (data[0].EDISizeDetail.MatrixDetail==undefined || data[0].EDISizeDetail.MatrixDetail.length==0))
                              {
                                delete data[0].EDISizeDetail;
                                
                              }
                              if((data[0].OrderHandeling ==undefined  || data[0].OrderHandeling.length == 0))
                              {
                                delete data[0].OrderHandeling;
                                
                              }
                              if((data[0].ItemRefs ==undefined  || data[0].ItemRefs.length == 0))
                              {
                                delete data[0].ItemRefs;
                                
                              }
                              if((data[0].CustRef ==undefined  || data[0].CustRef.length == 0))
                              {
                                delete data[0].CustRef;
                                
                              }
                              if((data[0].SupplierDetail ==undefined  || data[0].SupplierDetail.length == 0))
                              {
                                delete data[0].SupplierDetail;
                                
                              }
                              if(data[0].EDIHeader.EDICareandContent.Fibres==undefined || data[0].EDIHeader.EDICareandContent.Fibres.length==0)
                              {
                                delete data[0].EDIHeader.EDICareandContent.Fibres;
                              }
                              if(data[0].EDIHeader.EDICareandContent.FrabricStatments==undefined || data[0].EDIHeader.EDICareandContent.FrabricStatments.length==0)
                              {
                                delete data[0].EDIHeader.EDICareandContent.FrabricStatments;
                              }
                              if(data[0].EDIHeader.EDICareandContent.CareSymbolMappingID==undefined || data[0].EDIHeader.EDICareandContent.CareSymbolMappingID.length==0)
                              {
                                delete data[0].EDIHeader.EDICareandContent.CareSymbolMappingID;
                              }
                              //console.log(data);
                              if(data[0].length!==0){
                                console.log("Send Converted Json to Outbond API :" + api_url);
                                //writelog(logdir+logdatefilename,"Send Converted Json to Outbond API :" + api_url+"\n");
                                var prelogoutboundtest = prelogoutbound.replace("keywords","outboundURL");
                                writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+project_id+ " > posting "+file+" >  Outbond API : "+ api_url +"\n");
          
                                var options1 = {
                                    'method': 'POST',
                                    'url': api_url,
                                    'headers': {
                                      'Content-Type': 'text/plain'
                                    },
                                    formData:{
                                      'TuuJson':JSON.stringify(data)
                                    },
                                  }
                                  request(options1, function (error, response) {
                                    try
                                    {
                                      if(error)
                                      {
                                        //console.log(error);
                                        writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+project_id+ " > "+" posting JSON > "+ JSON.stringify(data) +" Response Of outbound API:\n"+JSON.stringify(error)+"\n");
                                      }
                                      else
                                      {
                                        var dataoutboundres = JSON.parse(response.body);
                                        console.log("response from outbound api");
                                        console.log(JSON.stringify(dataoutboundres));
                                        var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                                        // writelog(logdir+logdatefilename,"Response Of outbound API:\n"+JSON.stringify(dataoutboundres)+"\n");
                                        writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+project_id+ "  > posting JSON"+ JSON.stringify(data) +" > Response Of outbound API:\n"+JSON.stringify(response.body)+"\n");
          
                                        if(dataoutboundres.SaveType=="Success")
                                        {
                                          console.log("Outbound API run Successfully with Json");
                                          //writelog(logdir+logdatefilename,"Outbound API run Successfully with Json"+"\n");
                                          
                                          //writelog(logdir+logdatefilename,"Response Of outbound API:\n"+JSON.stringify(response.body)+"\n");
                                          console.log(dataoutboundres);
                                          succes=1;
                                          //outbound_run_counter_success=parseInt(outbound_run_counter_success+1);
                                        }
                                        else
                                        {
                                          console.log("Outbound API not run Successfully");
                                          //writelog(logdir+logdatefilename,"Outbound API Faild with Json"+"\n");
                                          //writelog(logdir+logdatefilename,"Response Of outbound API:\n"+JSON.stringify(response.body)+"\n");
                                          console.log(dataoutboundres);
                                          succes=0;
                                          //outbound_run_counter_fail=parseInt(outbound_run_counter_fail+1);
                            
                                        }
                                        
                                        //console.log(JSON.parse(response.body));
                                        //console.log(outbound_run_counter_fail);
                                      //}
                                      console.log("Json file save in output/history/project_id folder");
                                      
                                      //writelog(logdir+logdatefilename,"Json file save in output/history/project_id folder"+"\n");
                                      var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                                      writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+project_id+ " > Json file save in output/history/"+project_id+" folder"+"\n");
          
                                      var filenames = parseInt(crypto.randomBytes(2).toString('hex'), 16)+'.json';
                                        var filenames = file.split('.').slice(0, -1).join('.')+date.getFullYear()+parseInt(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+'.json';
                                        //console.log(filenames);
                                        const writefile = fs.writeFileSync(out_month_folder+'/'+filenames,JSON.stringify(data));
                                        var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                                        writelog(logdir+logdatefilename,prelogoutboundtest+" Json file saved :"+out_month_folder+'/'+filenames+"\n");
                                        /* fs.rename(directoryPath+'/'+file, month_folder+'/'+file, function (err) {
                                          if (err){
                                            console.log(err);
                                          } //throw err
                                          //console.log('Successfully renamed - AKA moved!');
                                        }) */
                                        //console.log("\nFile Contents of hello.txt:",
                                        fs.readFileSync(directoryPath+'/'+file, "utf8");
                                    
                                          try {
                                            fs.copyFileSync(directoryPath+'/'+file, month_folder+'/'+date.getFullYear()+parseInt(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+file,
                                              fs.constants.COPYFILE_EXCL);
                                            
                                            // Get the current filenames
                                            // after the function
                                          
                                          //console.log("\nFile Contents of "+month_folder+'/'+file+":",
                                              //fs.readFileSync(month_folder+'/'+file, "utf8"));
                                          }
                                          catch (err) {
                                            console.log(err);
                                            var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                                            writelog(logdir+logdatefilename,prelogoutboundtest+" error while json file saving into :"+out_month_folder+'/'+filenames+"\n");
                                          }
                                          try {
                                            fs.unlinkSync(directoryPath+'/'+file);
                                            console.log('successfully deleted '+ file);
                                            console.log("successfully json File saved in history folder");
                                          } catch (err) {
                                            // handle the error
                                          }
                                        //console.log(response);
                                      }
                                      
                                      try{
                                          //dataoutboundres = JSON.parse(response.body)
                                      }catch(e)
                                      {
                                        console.log(e);
                                      }
                                      //if (error){ 
                                        //throw new Error(error);
                                        //res.end({"Status":"false","Msg":"Wrong API Call"});
                                        //console.log(error);
                                      //}
                                      //else if(dataoutboundres==undefined)
                                      //{
                                        //res.send({"Status":"false","Msg":"Wrong API Call"});
                                      //}
                                      //else
                                      //{
                                        
                                      
                                      //console.log(result);
                                      //res.json({status:"1",Msg:"home/TUU_XML/TUU_sample 2.xml File Converted Successfully",Data:result});
                                    
                                    }catch(error)
                                    {
                                      console.log(error);
                                      var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                                      writelog(logdir+logdatefilename,prelogoutboundtest+" Error while call outbound API"+error+"\n");
                                    }
                                })
          
                              }
                              else{
                                
                                console.log("No json file found in this project No outbound Run");
                                //writelog(logdir+logdatefilename,"No json file found in this project No outbound Run"+"\n");
                                var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json-error");
                                writelog(logdir+logdatefilename,prelogoutboundtest+" Project Id > "+project_id+ " > Error in convert XML File >"+" "+file+"\n");
          
                                succes=0;
                                return res.status(200).json({Status:0,Msg:"Outbound Not Run"});
                              }
                            
                            
                         
                         
                       
                        //console.log(root);return;
                        
                        //console.log(nodes.length);return;
                       
                      }catch(err){
                        console.log("xml error found"+err);
                        var prelogoutboundtest = prelogoutbound.replace("keywords","not defined");
                        writelog(logdir+logdatefilename,prelogoutboundtest+" Error while XML parse for mapping field :"+directoryPath+'/'+file+"\n");
                      }
                    }
                    else
                    {
                      var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json-error");
                      writelog(logdir+logdatefilename,prelogoutboundtest+" error in to Json File :"+directoryPath+'/'+file+"\n");
                    }
                  }
                  
                  //t.end()
                }catch(err){
                  console.log("error log"+err);
                  var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json-error");
                        writelog(logdir+logdatefilename,prelogoutboundtest+" Error while transformed Json  :"+directoryPath+'/'+file+"\n");
                }
              })()
          }catch(error){
              console.log(error);
              var prelogoutboundtest = prelogoutbound.replace("keywords","converted2Json-error");
              writelog(logdir+logdatefilename,prelogoutboundtest+" Error while fetch file for convert into json Json  :"+directoryPath+'/'+file+"\n");
          }
        });
      }
    if(succes==1)
    {

      return res.json({Status:1,Msg:"outboundrun successfull",data:files});
    }
    else
    {
      return res.json({Status:0,Msg:"Outbound Not Run",data:files});

    }
});
  });
  // if(succes==1)
  // {
  //   res.json({Status:1,Msg:"outboundrun successfull"});
  // }
  // else
  // {
  //   res.json({Status:0,Msg:"outboundrun not run"});
  // }
});

router.post('/testfiles',function(req,res){
  var project_id = req.body.project_id;
  //console.log(project_id);
  var directoryPath= 'output/inbounds/'+project_id;
  // make project/date wise folder
  var date = new Date();
  var dir = './output/history/inbounds';
  var out_dir ='./output/history/outbounds';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(out_dir)){
    fs.mkdirSync(out_dir);
  }
  var projectdir = dir+'/'+project_id;
  if(!fs.existsSync(projectdir)){
    fs.mkdirSync(projectdir);
  }
  var out_projectdir = out_dir+'/'+project_id;
  if(!fs.existsSync(out_projectdir)){
    fs.mkdirSync(out_projectdir);
  }
  var yearfolder = projectdir+'/'+date.getFullYear();
  if(!fs.existsSync(yearfolder)){
    fs.mkdirSync(yearfolder);
  }
  var out_yearfolder = out_projectdir+'/'+date.getFullYear();
  if(!fs.existsSync(out_yearfolder)){
    fs.mkdirSync(out_yearfolder);
  }
  var month_folder = yearfolder+'/'+ parseInt(date.getMonth()+1);
  if(!fs.existsSync(month_folder)){
    fs.mkdirSync(month_folder);
  }
  var out_month_folder = out_yearfolder+'/'+ parseInt(date.getMonth()+1);
  if(!fs.existsSync(out_month_folder)){
    fs.mkdirSync(out_month_folder);
  }
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        //console.log(file); 
        try{
          const data = fs.readFileSync(directoryPath+'/'+file,{encoding:'utf8', flag:'r'});
          const xml = '`'+data+'`';
          ;(async function () {
            try{

              fs.readFileSync(directoryPath+'/'+file, "utf8");
            
                  try {
                    fs.copyFileSync(directoryPath+'/'+file, month_folder+'/'+file,
                      fs.constants.COPYFILE_EXCL);
                    
                    // Get the current filenames
                    // after the function
                  
                  console.log("\nFile Contents of "+month_folder+'/'+file+":",
                      fs.readFileSync(month_folder+'/'+file, "utf8"));
                  }
                  catch (err) {
                    console.log(err);
                  }
                  try {
                    fs.unlinkSync(directoryPath+'/'+file);
                    console.log('successfully deleted /tmp/hello');
                  } catch (err) {
                    log(err);
                    // handle the error
                  }
              //console.log(result);
              //res.json({status:"1",Msg:"home/TUU_XML/TUU_sample 2.xml File Converted Successfully",Data:result});
            }catch(err)
            {
              console.log(err);
            }
            //console.log(JSON.stringify(result));
        
            //const prettyStr = await prettyPrint(xml, { indentSize: 4})
            //console.log(prettyStr)
        })()
        }catch(error){
            console.log(error);
        }
    });
    //res.json({Status:1,Msg:"outboundrun successfull",data:files});
});
})
router.post('/testFtp',function(req,res){
  var settings = {
    host:req.body.host,
    user:req.body.user,
    password:req.body.password,
    port:req.body.port,
    secure:false,
  }
  var folderpath = req.body.folderpath;
  const client = new ftp.Client()
    client.ftp.verbose = true;
    (async () =>{

      try {
          await client.access(settings)
          //console.log(await client.list())
          res.json({Status:1,Msg:"connection successfully",Data:[]});
      }
      catch(err) {
          //console.log(err);
          if(err.code==504)
          {
            res.json({Status:0,Msg:"Tls Protection Required !",Data:[]});
          }
          else
          {
            res.json({Status:0,Msg:"Login Incorrect !",Data:[]});
          }
      }
      client.close()
    })();
})

router.post('/convertxmltojson',function(req,res){
  let xml_string = req.body.xml_content;
  let api_url = "https://portalpredeployadmin.1-label.com/API/TUUEdi/TuuImportApi.aspx";
  //xml_string = xml_string.replace(/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->)(.|\n))*-->/g,"");
  //const Buffer = fs.readFileSync("./output/inbounds/62726537306b48d8a4d962bd/RAB_20220510091428210_202205108202203_2022051115555981_2022051212597919.xml",'utf-8');
   //xml_string = ${Buffer.toString()}; 
   
  //console.log(xml_string);
  var parser = new xmldom.DOMParser();
  
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
        "${defaultValue}",
        1,
        number(not(text())) * string-length("${defaultValue}")
    )
)`
   const xml = '`'+xml_string+'`';
   console.log("xml\n" + xml);
      
      const template = ['//WebOrder',{
  
        OrderHandling:[
          '//POHeader/OrderHandling/Variable',
          {
            ID:'ID',
            Data:'Data'
          }
        ],
        CustRef:[
          '//POHeader/CustRef/Variable',
          {
            ID:'ID',
            Data:'Data'
          }
        ],
        SupplierDetail:['//POHeader/SupplierDetail/Variable',
          {
            //ID:'SupplierNo',
            //Data:'FactoryNo'
            //Brand:textOrDefault('boden'),
            ID:"ID",
            Data:"Data"
          }
        ],
        ItemRefs:[
          '//POHeader/ItemRefs/Variable',
          {
            ID:'ID',
            Data:'Data'
            
          }
        ],
        
        EDIHeader:{
          
            EDIVariables:['//EDIHeader/EDIVariables/Variable',{
              ID:"ID",
              Data:"Data"
            }],
            EDICareandContent:{
              Fibres:{

                FibreComponents:['//EDIHeader/EDICareandContent/Fibre/FibreComponents/Variable',{
                  ID:"ID",
                  Data:"Data"
                }],
                
              },
              FrabricStatments:['//EDIHeader/EDICareandContent/FrabricStatments/Variable',{
                ID:'ID',
                Data:'Data'
              }],
              CareSymbolMappingID:['//EDIHeader/EDICareandContent/CareSymbolMappingID/Variable',{
                ID:'ID',
                Data:'Data'
              }]
            }


          },
       
        
          EDISizeDetail:{
            EDISize:['//EDISizeDetail/EDISize',{

              Variable:['//EDISizeDetail/EDISize/Variable',{
                ID:'ID',
                Data:'Data'
              }],
              MatrixDetail:['//EDISizeDetail/EDISize/MatrixDetail/Variable',{
                ID:'ID',
                Data:'Data'
              }]
            }]
            
          }
      
      }]
     
        ;(async function () {
            try{
              //console.log("before transform"+xml);
              //xml_string = await prettyPrint(xml.toString());
              //console.log("xml string\n"+xml_string);
              let xml_string =`��<?xml version="1.0" encoding="utf-8"?>
              <WebOrder>
                  <EDIHeader>
                      <EDICareandContent>
                          <CareSymbolMappingID>
                              <Variable>
                                  <ID>CareMapping_1</ID>
                                  <Data>WASH - 30 mild wash.jpg</Data>
                              </Variable>
                              <Variable>
                                  <ID>CareMapping_2</ID>
                                  <Data>BLEACH - Do not bleach.jpg</Data>
                              </Variable>
                              <Variable>
                                  <ID>CareMapping_3</ID>
                                  <Data>DRY - Tumble dry, Low (60C).jpg</Data>
                              </Variable>
                              <Variable>
                                  <ID>CareMapping_4</ID>
                                  <Data>IRON - DO NOT iron.jpg</Data>
                              </Variable>
                              <Variable>
                                  <ID>CareMapping_5</ID>
                                  <Data>DRY CLEAN - DO NOT dry clean.jpg</Data>
                              </Variable>
                          </CareSymbolMappingID>
                          <Fibre>
                              <FibreComponents>
                                  <Variable>
                                      <ID>FibreComponent</ID>
                                      <Data>Outer:</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyamide with ePTFE membrane</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>100</Data>
                                  </Variable>
                              </FibreComponents>
                              <FibreComponents>
                                  <Variable>
                                      <ID>FibreComponent</ID>
                                      <Data>Panels</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyamide with ePTFE membrane</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>100</Data>
                                  </Variable>
                              </FibreComponents>
                              <FibreComponents>
                                  <Variable>
                                      <ID>FibreComponent</ID>
                                      <Data>Reinforcement panels</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyamide</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>54</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyester</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>33</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyurethane</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>13</Data>
                                  </Variable>
                              </FibreComponents>
                              <FibreComponents>
                                  <Variable>
                                      <ID>FibreComponent</ID>
                                      <Data>Lining</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyester</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>100</Data>
                                  </Variable>
                              </FibreComponents>
                              <FibreComponents>
                                  <Variable>
                                      <ID>FibreComponent</ID>
                                      <Data>Insulation </Data>
                                  </Variable>
                                  <Variable>
                                      <ID>FibreName</ID>
                                      <Data>Polyester Recycled fibres</Data>
                                  </Variable>
                                  <Variable>
                                      <ID>Percent</ID>
                                      <Data>100</Data>
                                  </Variable>
                              </FibreComponents>
                          </Fibre>
                          <FrabricStatments>
                              <Variable>
                                  <ID>Statement</ID>
                                  <Data>Close all closures before wash</Data>
                              </Variable>
                              <Variable>
                                  <ID>Statement</ID>
                                  <Data>Use Liquid Detergent</Data>
                              </Variable>
                              <Variable>
                                  <ID>Statement</ID>
                                  <Data>To reactivate water-repellent treatment tumble dry at low temperature or iron on cool setting</Data>
                              </Variable>
                              <Variable>
                                  <ID>Statement</ID>
                                  <Data>For specific care instructions always refer to garment manufacturers recommendations</Data>
                              </Variable>
                          </FrabricStatments>
                      </EDICareandContent>
                      <EDIVariables>
                          <Variable>
                              <ID>Country Of Manufacture</ID>
                              <Data>Made in China</Data>
                          </Variable>
                      </EDIVariables>
                  </EDIHeader>
                  <POHeader>
                      <CustRef>
                          <Variable>
                              <ID>Purchase Order No</ID>
                              <Data>QIO-82-Khroma Volition Pants</Data>
                          </Variable>
                          <Variable>
                              <ID>Style Description</ID>
                              <Data>Khroma Volition Pants</Data>
                          </Variable>
                          <Variable>
                              <ID>Style Number</ID>
                              <Data>QIO-82</Data>
                          </Variable>
                      </CustRef>
                      <ItemRefs>
                          <Variable>
                              <ID>ItemRef</ID>
                              <Data>RAB01</Data>
                          </Variable>
                      </ItemRefs>
                      <OrderHandling>
                          <Variable>
                              <ID>GarmentLabelFlag</ID>
                              <Data>Y</Data>
                          </Variable>
                          <Variable>
                              <ID>ImportAs</ID>
                              <Data>PO</Data>
                          </Variable>
                          <Variable>
                              <ID>LastUpdateDate</ID>
                              <Data>20220510091428</Data>
                          </Variable>
                          <Variable>
                              <ID>SizeChartModel</ID>
                              <Data>Data</Data>
                          </Variable>
                      </OrderHandling>
                      <SupplierDetail>
                          <Variable>
                              <ID>FactoryNo</ID>
                              <Data>Honstar</Data>
                          </Variable>
                          <Variable>
                              <ID>SupplierNo</ID>
                              <Data>Honstar</Data>
                          </Variable>
                      </SupplierDetail>
                  </POHeader>
              </WebOrder>`;
              const result = await transform(xml, template);
              console.log('result\n'+JSON.stringify(result));
              var data = result;

              var root = parser.parseFromString(xml, 'text/xml');
              var nodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents', root);
              //console.log(nodes.length);
              var counter=1;
              var fibres={}
              nodes.forEach(function(item,i){
                var fibrecomponents='';
                //console.log(counter);
                if(i==0)
                {

                  var fibrecomponents =nodes[i].localName+ "_"+counter;
                }
                else
                {
                  var fibrecomponents =nodes[i].localName + "_"+counter;
                }
                var Variablenodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable', root);
                //console.log(Variablenodes[1].localName + ": " + Variablenodes);
                var node_variable_counter=1
                fibres[fibrecomponents] = [];
                Variablenodes.forEach(function(item,j){
                  var id = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter +']/ID', root);
                  var data1 = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter+']/Data', root);
                  
                  fibres[fibrecomponents][j]={'ID':id[0].firstChild.data,'Data':data1[0].firstChild.data};
                  node_variable_counter++;
                  
                })
                counter++;
                //console.log(Variablenodes.firstChile);
              })
              //console.log(fibres);
              data[0].SupplierDetail.push({ID:"Brand",Data:"RAB Care Label Portal"});
              console.log("data\n"+JSON.stringify(data));
              data[0].EDIHeader.EDICareandContent.Fibres = fibres;
              
              if((data[0].EDISizeDetail.EDISize.length ==undefined  || data[0].EDISizeDetail.EDISize.length ==0) && (data[0].EDISizeDetail.MatrixDetail==undefined || data[0].EDISizeDetail.MatrixDetail.length==0))
              {
                delete data[0].EDISizeDetail;
                
              }
              if((data[0].OrderHandeling ==undefined  || data[0].OrderHandeling.length == 0))
              {
                delete data[0].OrderHandeling;
                
              }
              if((data[0].ItemRefs ==undefined  || data[0].ItemRefs.length == 0))
              {
                delete data[0].ItemRefs;
                
              }
              if((data[0].CustRef ==undefined  || data[0].CustRef.length == 0))
              {
                delete data[0].CustRef;
                
              }
              if((data[0].SupplierDetail ==undefined  || data[0].SupplierDetail.length == 0))
              {
                delete data[0].SupplierDetail;
                
              }
              if(data[0].EDIHeader.EDICareandContent.Fibres==undefined || data[0].EDIHeader.EDICareandContent.Fibres.length==0)
              {
                delete data[0].EDIHeader.EDICareandContent.Fibres;
              }
              if(data[0].EDIHeader.EDICareandContent.FrabricStatments==undefined || data[0].EDIHeader.EDICareandContent.FrabricStatments.length==0)
              {
                delete data[0].EDIHeader.EDICareandContent.FrabricStatments;
              }
              if(data[0].EDIHeader.EDICareandContent.CareSymbolMappingID==undefined || data[0].EDIHeader.EDICareandContent.CareSymbolMappingID.length==0)
              {
                delete data[0].EDIHeader.EDICareandContent.CareSymbolMappingID;
              }
              res.json({status:"1",Msg:"TUU XML File Converted Successfully",Data:data});
             
            }catch(err)
            {
              console.log(err);
            }
          
            //console.log(JSON.stringify(result));
        
            //const prettyStr = await prettyPrint(xml, { indentSize: 4})
            //console.log(prettyStr)
        })()
})
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function cleanString(input) {
  var output = "";
  for (var i=0; i<input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
          output += input.charAt(i);
      }
  }
  return output;
}
function removeSpaceFromXMLTag( input )
{
   //return input.replace(/<(\/){0,1}[\w\s]+>/g, function(match){ return match.replace( /\s+/, "" ) });
   return input.replace(/<(\/)?[\w\s]+>/g, function(match){ return match.replace( /\s+/, "" ) });
}
function parseXml(xmlString) {
  //var parser = new DOMParser();
  var parser = new xmldom.DOMParser();
  // attempt to parse the passed-in xml
  var dom = parser.parseFromString(xmlString, 'application/xml');
  if(isParseError(dom)) {
      throw new Error('Error parsing XML');
  }
  return dom;
}

function isParseError(parsedDocument) {
  // parser and parsererrorNS could be cached on startup for efficiency
  var parser = new xmldom.DOMParser(),
      errorneousParse = parser.parseFromString('<', 'application/xml'),
      parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

  if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
      // In PhantomJS the parseerror element doesn't seem to have a special namespace, so we are just guessing here :(
      return parsedDocument.getElementsByTagName("parsererror").length > 0;
  }

  return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
};
function groupChildren(obj) {
  for(prop in obj) {
    if (typeof obj[prop] === 'object') {
      groupChildren(obj[prop]);
    } else {
      obj['$'] = obj['$'] || {};
      obj['$'][prop] = obj[prop];
      delete obj[prop];
    }
  }

  return obj;
}
module.exports = router;
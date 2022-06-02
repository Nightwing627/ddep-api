var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const crypto = require('crypto');
const { transform, prettyPrint } = require('camaro');
var xmldom = require('xmldom');

var xpath = require('xpath');
const ftp = require("basic-ftp");
//const ftp = require('../my_modules/FTPClient');
//const newftp = require('../my_modules/FTP');
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
router.post('/run', inbound.create);
router.post('/findbyproject_id',inbound.findByProjectId);
router.put('/:id',inbound.update);
router.post('/runbyuser',function(req,res){
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
})

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
  //var c = new newftp(host,port,user,password,is_secure);
  //var list = c.getdirectorylist('/home/TUU_XML');
  //console.log(list);
  //   c.connect({
  //     host:host,
  //     user:user,
  //     password:password,
  //     port:port,
  //     secure:true
  //   });
  //   c.on('ready', function() {
  //     c.list(function(err, list) {
  //       if (err) throw err;
  //       console.log(list);
        
  //     });
  // });
  //c.end();
  var ftp = new Client()
        //const filelist=[];
        //var c = ftp.connect(this.settings);
        var filelist = [];
        ftp.connect(setting);

                ftp.on('ready', function() {
                ftp.list('home/TUU_XML',function(err, list) {
                if (err){
                    throw err;
                } 
                //console.log(list);
                for (let index = 0; index < list.length; index++) {
                    if((list[index].type!=="d")){
                        filelist.push(list[index].name);
                    }
                    // console.log(filelist);
                    //console.log(list[index].name);
                }
                    //return JSON.stringify(list);
                    res.json({"status":1,"msg":"run successfully","data":filelist});
                    
                //console.log(filelist);
                });
           
        })
        //console.log(filelist);
        //return filelist;
});

router.get('/testjson',function(req,res){
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
      var content = '';
      var c = new Client();
        c.connect(setting);
        c.on('ready', function() {
            c.get('home/TUU_XML/TUU_boden 2.xml', function(err, stream) {
                 
                 stream.on('data', function(chunk) {
                     content += chunk.toString();
                 });
                 stream.on('end', function() {
                     // content variable now contains all file content. 
                     //console.log(content);
                     const textOrDefault = (defaultValue) => `concat(
                      text(),
                      substring(
                          "${defaultValue}",
                          1,
                          number(not(text())) * string-length("${defaultValue}")
                      )
                  )`
                     const xml = '`'+content+'`';
                      //console.log("xml" + xml);
                            const template = ['/WebOrder',{

                              OrderHandeling:[
                                '//POHeader/OrderHandeling/Variable',
                                {
                                  ID:'OH_ID',
                                  value:'OH_Data'
                                }
                              ],
                              CustRef:[
                                '//POHeader/CustRef/Variable',
                                {
                                  ID:'CR_ID',
                                  value:'CR_Data'
                                }
                              ],
                              SupplierDetail:[
                                '//POHeader/SupplierDetail',
                                {
                                  Brand:textOrDefault('testwithmike'),
                                  ID:'ID',
                                  Data:'Data'
                                }
                              ],
                              ItemRefs:[
                                '//POHeader/ItemRefs/Variable',
                                {
                                  ItemRef:'ITemRef',
                                  
                                }
                              ],
                              EDI_Variables:[
                                '//EDIHeader/EDI_Variables/Variable',
                                {
                                  ID:'EDI_HName',
                                  value:'EDI_HValue'
                                  
                                }
                              ],
                               
                              FibreComponent:['//EDIHeader/EDI_CareandContent/Fibre/FibreComponent/Variable',{
                                FibreComponentName:'../FibreComponentName',
                                FibreName:'FibreName',
                                FibrePercent:'FibrePercent'
                                }],
                                
                                  
                                  
                              FrabricStatments:['//EDIHeader/EDI_CareandContent/FrabricStatments/Variable',{
                                Statment:'Statment'
                              }],
                              CareSymbolMappingID:['//EDIHeader/EDI_CareandContent/CareSymbolMappingID/Variable',{
                                CareMappingID:'CareMappingID'
                              }],
                              SizeDetail:[
                                '//EDISizeDetail/EDI_Size',
                                {
                                  SizeChartID:'SizeChartID',
                                  Size:'EDIPrimarySize',
                                  TicketQuantity:['//EDISizeDetail/EDI_Size/Variable',{
                                    Quantity:'TicketQuantity'
                                  }],
                                  MatrixDetail:['//EDISizeDetail/EDI_Size/MatrixDetail/Variable',{
                                    ID:'EDISizeDetail_Name',
                                    Value:'EDISizeDetail_Value'
                                  }]
                                  
                                }
                              ],
                            }]
                              
                              
                              // name: 'String(name)',
                              // jerseyNumber: '@jerseyNumber',
                              // yearOfBirth: 'number(yearOfBirth)',
                              // isRetired: 'boolean(isRetired = "true")'
                          
                          
                          ;(async function () {
                              try{

                                const result = await transform(xml, template)
                                res.json({status:"1",Msg:"home/TUU_XML/TUU_sample 2.xml File Converted Successfully",Data:result});
                              }catch(err)
                              {
                                console.log(err);
                              }
                              //console.log(JSON.stringify(result));
                          
                              //const prettyStr = await prettyPrint(xml, { indentSize: 4})
                              //console.log(prettyStr)
                          })()
      
                 });
            });
        });
  
      //res.json({status:"1",Data:"result"});
});

router.post('/inboundrun',function(req, res){
  //console.log(req.body.project_id);
  var options = {
    method:"GET",
    url:"inbound_setting/editAPI/"+req.body.project_id
  }

  request(config.domain+'/'+options.url, function (error, response, body){
    if(error)
    {
      console.log(error);
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
      ftp.on('ready', function() {
        ftp.mkdir(folderpath+'/'+backup_folder,function(err){
          if(err)
          {
            //console.log(folderpath+'/'+backup_folder);
            //console.log(err);
            console.log("backup folder not created");
          }
          else
          {
            console.log("backup folder created");
          }
        })
        ftp.list(folderpath,function(err, list) {
          if (err){
            console.log(err);
            return res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
          } 
          else
          {
            //console.log(list.length);
            //console.log(list);
            var filescounter=0;
            if(list.length <= 0)
            {
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
                  if (err)
                  {
                    console.log("error in "+list[index].name);
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
                      }
                    })
                  }
                  // stream.once('close', function() { ftp.end(); });
                  // stream.on('data', function(chunk) {
                  //   content += chunk.toString();
                  // });
                  // stream.on('end', function() {
                  //   try {
                  //     //console.log(date);
                  //     const data = fs.writeFileSync(dir+'/'+projectdir+'/'+date+'.xml', content);
                  //     //console.log(data);
                  //     if(data==undefined)
                  //     {
                  //       //remove from FTP Logic goes here
                  //     }
                  //     //file written successfully
                  //   } catch (err) {
                  //     console.error(err)
                  //   }
                  //   //fs.writeFile(dir+'/'+projectdir,content);
                  //   //console.log(content);
                  // });
                });
              }
            }
            if(filescounter==0)
            {
              return res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
              ftp.end();
            }
            else
            {
              return res.json({Status:1,Msg:"Inbound File Saved",Data:[]});
              ftp.end();
            }
          } 
        });
      })
      ftp.connect(settings);
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
                data[0].SupplierDetail.push({ID:"Brand",Data:"boden"});

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
  // this.responseText = JSON.stringify({status:1,data:body});
  // res.json({"status":1,Msg:"call",data:reso});
});

function user_api(project_id, reqBody, res)
{
  var outbound_url = config.domain+"/outbound_setting/editAPI/"+project_id;

  request(outbound_url, function (error, response, body) {
    if(error) {
      return res.json({
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
    var outboundSetting = JSON.parse(body);
    var outbound_api_url = outboundSetting.api_url
    try {
      var result = JSON.parse(JSON.stringify(reqBody));
      var out_data = result;
      if(out_data.length !== 0) {
        var outbound_api_options = {
          'method': 'POST',
          'url': outbound_api_url,
          'headers': {
            'Content-Type': 'text/plain'
          },
          formData:{
            'TuuJson':JSON.stringify(out_data)
          },
        }
        request(outbound_api_options, function (error, response) {
          if (error) {
            return res.json({
              code: "1",
              MsgCode: "50001",
              MsgType: "Invalid-Source",
              MsgLang: "en",
              ShortMsg: "Fail",
              LongMsg: error.message || "Some error occurred while run the outbound.",
              InternalMsg: "",
              EnableAlert: "No",
              DisplayMsgBy: "LongMsg",
              Data: []
            });
          }
          try {
            dataoutboundres = JSON.parse(response.body);
            if(dataoutboundres.SaveType == "Success") {
              console.log('data successfull');
              return res.status(200).send({
                code: "0",
                MsgCode: "10001",
                MsgType: "Data-Success",
                MsgLang: "en",
                ShortMsg: "Successful",
                LongMsg: "The data send successful",
                InternalMsg: "",
                EnableAlert: "No",
                DisplayMsgBy: "ShortMsg",
                Data: []
              });
            } else {
              console.log(dataoutboundres.Msg);
              return res.status(500).send({
                code: "1",
                MsgCode: "50001",
                MsgType: "Exception-Error",
                MsgLang: "en",
                ShortMsg: "Data Send Fail",
                LongMsg: dataoutboundres.Msg || "Some error occurred while creating the project.",
                InternalMsg: "",
                EnableAlert: "No",
                DisplayMsgBy: "LongMsg",
                Data: []
              });
            }
          } catch(e) {
            return res.json({
              code: "1",
              MsgCode: "50001",
              MsgType: "Invalid-Source",
              MsgLang: "en",
              ShortMsg: "Fail",
              LongMsg: e.message || "Some error occurred while run the outbound.",
              InternalMsg: "",
              EnableAlert: "No",
              DisplayMsgBy: "LongMsg",
              Data: []
            });
          }
        });
      }
    } catch(err) {
      return res.json({
        code: "1",
        MsgCode: "50001",
        MsgType: "Invalid-Source",
        MsgLang: "en",
        ShortMsg: "Fail",
        LongMsg: err.message || "Some error occurred while post data in the outbound api.",
        InternalMsg: "",
        EnableAlert: "No",
        DisplayMsgBy: "LongMsg",
        Data: []
      });
    }
  });
}

router.post('/outboundrun',function(req,res){
  var project_id = req.body.project_id;
  var project_code = req.body.project_code;
  console.log(project_id);
  var directoryPath= 'output/inbounds/'+project_id;
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
      "${defaultValue}",
      1,
      number(not(text())) * string-length("${defaultValue}")
    )
  )`
  const template = ['/WebOrder',{

    OrderHandling:[
      '//POHeader/OrderHandeling/Variable',
      {
        ID:'OH_ID',
        value:'OH_Data'
      }
    ],
    CustRef:[
      '//POHeader/CustRef/Variable',
      {
        ID:'CR_ID',
        value:'CR_Data'
      }
    ],
    SupplierDetail:[
      '//POHeader/SupplierDetail',
      {
        //Brand:textOrDefault('boden'),
        ID:'ID',
        Data:'Data'
      }
    ],
    ItemRefs:[
      '//POHeader/ItemRefs/Variable',
      {
        ItemRef:'ITemRef',
        
      }
    ],
    EDI_Variables:[
      '//EDIHeader/EDI_Variables/Variable',
      {
        ID:'EDI_HName',
        value:'EDI_HValue'
        
      }
    ],
    
    FibreComponent:['//EDIHeader/EDI_CareandContent/Fibre/FibreComponent/Variable',{
      FibreComponentName:'../FibreComponentName',
      FibreName:'FibreName',
      FibrePercent:'FibrePercent'
      }],
      
        
        
    FrabricStatments:['//EDIHeader/EDI_CareandContent/FrabricStatments/Variable',{
      Statment:'Statment'
    }],
    CareSymbolMappingID:['//EDIHeader/EDI_CareandContent/CareSymbolMappingID/Variable',{
      CareMappingID:'CareMappingID'
    }],
    SizeDetail:[
      '//EDISizeDetail/EDI_Size',
      {
        SizeChartID:'SizeChartID',
        Size:'EDIPrimarySize',
        TicketQuantity:['//EDISizeDetail/EDI_Size/Variable',{
          Quantity:'TicketQuantity'
        }],
        MatrixDetail:['//EDISizeDetail/EDI_Size/MatrixDetail/Variable',{
          ID:'EDISizeDetail_Name',
          Value:'EDISizeDetail_Value'
        }]
        
      }
    ],
  }]
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
        //Brand:textOrDefault(project_code),
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
  }]
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
          const lineReader = require('line-reader');
          const data = fs.readFileSync(directoryPath+'/'+file,"UTF-8");
          let dumydata='��<?xml version="1.0" encoding="utf-8"?>\n<WebOrder>\n    <EDIHeader>\n        <EDICareandContent>\n            <CareSymbolMappingID>\n                <Variable>\n                    <ID>CareMapping_1</ID>\n                    <Data>WASH - 30 mild wash.jpg</Data>\n                </Variable>\n                <Variable>\n                    <ID>CareMapping_2</ID>\n                    <Data>BLEACH - Do not bleach.jpg</Data>\n                </Variable>\n                <Variable>\n                    <ID>CareMapping_3</ID>\n                    <Data>DRY - Tumble dry, Low (60C).jpg</Data>\n                </Variable>\n                <Variable>\n                    <ID>CareMapping_4</ID>\n                    <Data>IRON - DO NOT iron.jpg</Data>\n                </Variable>\n                <Variable>\n                    <ID>CareMapping_5</ID>\n                    <Data>DRY CLEAN - DO NOT dry clean.jpg</Data>\n                </Variable>\n            </CareSymbolMappingID>\n            <Fibre>\n                <FibreComponents>\n                    <Variable>\n                        <ID>FibreComponent</ID>\n                        <Data>Outer:</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyamide with ePTFE membrane</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>100</Data>\n                    </Variable>\n                </FibreComponents>\n                <FibreComponents>\n                    <Variable>\n                        <ID>FibreComponent</ID>\n                        <Data>Panels</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyamide with ePTFE membrane</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>100</Data>\n                    </Variable>\n                </FibreComponents>\n                <FibreComponents>\n                    <Variable>\n                        <ID>FibreComponent</ID>\n                        <Data>Reinforcement panels</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyamide</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>54</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyester</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>33</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyurethane</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>13</Data>\n                    </Variable>\n                </FibreComponents>\n                <FibreComponents>\n                    <Variable>\n                        <ID>FibreComponent</ID>\n                        <Data>Lining</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyester</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>100</Data>\n                    </Variable>\n                </FibreComponents>\n                <FibreComponents>\n                    <Variable>\n                        <ID>FibreComponent</ID>\n                        <Data>Insulation </Data>\n                    </Variable>\n                    <Variable>\n                        <ID>FibreName</ID>\n                        <Data>Polyester Recycled fibres</Data>\n                    </Variable>\n                    <Variable>\n                        <ID>Percent</ID>\n                        <Data>100</Data>\n                    </Variable>\n                </FibreComponents>\n            </Fibre>\n            <FrabricStatments>\n                <Variable>\n                    <ID>Statement</ID>\n                    <Data>Close all closures before wash</Data>\n                </Variable>\n                <Variable>\n                    <ID>Statement</ID>\n                    <Data>Use Liquid Detergent</Data>\n                </Variable>\n                <Variable>\n                    <ID>Statement</ID>\n                    <Data>To reactivate water-repellent treatment tumble dry at low temperature or iron on cool setting</Data>\n                </Variable>\n                <Variable>\n                    <ID>Statement</ID>\n                    <Data>For specific care instructions always refer to garment manufacturers recommendations</Data>\n                </Variable>\n            </FrabricStatments>\n        </EDICareandContent>\n        <EDIVariables>\n            <Variable>\n                <ID>Country Of Manufacture</ID>\n                <Data>Made in China</Data>\n            </Variable>\n        </EDIVariables>\n    </EDIHeader>\n    <POHeader>\n        <CustRef>\n            <Variable>\n                <ID>Purchase Order No</ID>\n                <Data>QIO-82-Khroma Volition Pants</Data>\n            </Variable>\n            <Variable>\n                <ID>Style Description</ID>\n                <Data>Khroma Volition Pants</Data>\n            </Variable>\n            <Variable>\n                <ID>Style Number</ID>\n                <Data>QIO-82</Data>\n            </Variable>\n        </CustRef>\n        <ItemRefs>\n            <Variable>\n                <ID>ItemRef</ID>\n                <Data>RAB01</Data>\n            </Variable>\n        </ItemRefs>\n        <OrderHandling>\n            <Variable>\n                <ID>GarmentLabelFlag</ID>\n                <Data>Y</Data>\n            </Variable>\n            <Variable>\n                <ID>ImportAs</ID>\n                <Data>PO</Data>\n            </Variable>\n            <Variable>\n                <ID>LastUpdateDate</ID>\n                <Data>20220510091428</Data>\n            </Variable>\n            <Variable>\n                <ID>SizeChartModel</ID>\n                <Data>Data</Data>\n            </Variable>\n        </OrderHandling>\n        <SupplierDetail>\n            <Variable>\n                <ID>FactoryNo</ID>\n                <Data>Honstar</Data>\n            </Variable>\n            <Variable>\n                <ID>SupplierNo</ID>\n                <Data>Honstar</Data>\n            </Variable>\n        </SupplierDetail>\n    </POHeader>\n</WebOrder>'
          //var parser = new xmldom.DOMParser();
          let xmldata = '';
        //   lineReader.eachLine(directoryPath+'/'+file, (line, last) => {
        //    xmldata+=JSON.stringify(line+"\n");
        //    console.log(xmldata);
        // });
        
          console.log("xml data==\n"+xmldata);
          const xml = '`'+data+'`';

          ;(async function () {
            try{
                  const options = {
                    url:  config.domain+'/inbound/convertxmltojson',
                    'headers': {
                           'Content-Type': 'application/x-www-form-urlencoded'
                         },
                    form: {
                      'xml_content': "'"+xml+"'",
                        
                    }
                };
                
                request.post(options, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(JSON.parse(body));
                });
                // var options1 = {
                //   'method': 'POST',
                //   'url': config.domain+'/inbound/convertxmltojson',
                //   'headers': {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                //   },
                //   form: {
                //     'xml_content': "`"+dumydata+"`"
                //   }
                // };
                // request(options1, function (error, response) {
                //   if (error) throw new Error(error);
                //   console.log(response.body);
                // });
              // request.post({
              //   headers: {'content-type' : 'application/x-www-form-urlencoded'},
              //   url:     config.domain+'/inbound/convertxmltojson',
              //   body:    "xml_content="+data
              // }, function(error, response, body){
              //   if(error)
              //   {
              //     console.log(error);
              //   }
              //   else
              //   {

              //     console.log(response);
              //     var filenames = file.split('.').slice(0, -1).join('.')+'.json';
              //     console.log(filenames);
              //     const writefile = fs.writeFileSync(out_month_folder+'/'+filenames,JSON.stringify(response.Data));
              //     /* fs.rename(directoryPath+'/'+file, month_folder+'/'+file, function (err) {
              //       if (err){
              //         console.log(err);
              //       } //throw err
              //       //console.log('Successfully renamed - AKA moved!');
              //     }) */
              //     //console.log("\nFile Contents of hello.txt:",
              //     fs.readFileSync(directoryPath+'/'+file, "utf8");
              
              //       try {
              //         fs.copyFileSync(directoryPath+'/'+file, month_folder+'/'+file,
              //           fs.constants.COPYFILE_EXCL);
                      
              //         // Get the current filenames
              //         // after the function
                    
              //       console.log("\nFile Contents of "+month_folder+'/'+file+":",
              //           fs.readFileSync(month_folder+'/'+file, "utf8"));
              //       }
              //       catch (err) {
              //         console.log(err);
              //       }
              //       try {
              //         fs.unlinkSync(directoryPath+'/'+file);
              //         console.log('successfully deleted');
              //       } catch (err) {
              //         // handle the error
              //       }
              //   }
              //     //console.log(body);
              // });
              
              //res.json({status:"1",Msg:"TUU XML File Converted Successfully",Data:data});
             
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
  });
    
  res.json({Status:1,Msg:"outboundrun successfull"});
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
  console.log(xml_string.toString());
  xml_string.toString();
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
   const xml = xml_string;
   // console.log("xml\n" + xml);
      
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
              const result = await transform(xml_string.toString(), template);
              console.log('result\n'+JSON.stringify(result));
              var data = result;

              var root = parser.parseFromString(xml_string.toString(), 'text/xml');
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
              //res.json({status:"1",Msg:"TUU XML File Converted Successfully",Data:data});
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
                  //console.log(response);
                  var dataoutboundres = undefined;
                  try{
                      dataoutboundres = JSON.parse(response.body)
                  }catch(e)
                  {
                    console.log(e);
                  }
                  if (error){ 
                    //throw new Error(error);
                    //res.end({"Status":"false","Msg":"Wrong API Call"});
                    console.log("errro in outbound set API\n\n===============================");
                    //console.log(error);
                    console.log("\n\n===========================");
                  }
                  else if(dataoutboundres==undefined)
                  {
                    //res.send({"Status":"false","Msg":"Wrong API Call"});
                  }
                  else
                  {
                    var dataoutboundres = JSON.parse(response.body);
                    console.log("\n\nOutbound set API Response\n\n=======================");
                    //console.log(dataoutboundres);
                    console.log("\n\n===============================");
                    if(dataoutboundres.SaveType=="Success")
                    {
                      res.send({"msg":"success",Data:data});
                      //outbound_run_counter_success=parseInt(outbound_run_counter_success+1);
                    }
                    else
                    {
                      res.send({"msg":"fail",Data:data});
                      //outbound_run_counter_fail=parseInt(outbound_run_counter_fail+1);
        
                    }
                    
                    //console.log(JSON.parse(response.body));
                    //console.log(outbound_run_counter_fail);
                  }
                }catch(error)
                {
                  console.log(error);
                }
            })

            }catch(err)
            {
              console.log(err);
            }
          
            //console.log(JSON.stringify(result));
        
            //const prettyStr = await prettyPrint(xml, { indentSize: 4})
            //console.log(prettyStr)
        })()
})


module.exports = router;
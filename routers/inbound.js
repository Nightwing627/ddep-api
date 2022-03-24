var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const crypto = require('crypto');
const { transform, prettyPrint } = require('camaro');

const ftp = require("basic-ftp")
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
                                  SupplierNo:'SupplierNo',
                                  FactoryNo:'FactoryNo'
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
})
router.post('/inboundrun',function(req,res){
  //console.log(req.body.project_id);
  var options = {
    method:"GET",
    url:"inbound_setting/editAPI/"+req.body.project_id
  }

  request(config.domain+'/'+options.url, function (error, response, body){
    if(error)
    {
        console.log(error);
      res.json({"Status":0,"Msg":"Invalid Method"});
    }
    var inboundSetting = JSON.parse(body);
    var secure=false;
    if(inboundSetting.is_password_encrypted=="yes")
    {
      secure=true;
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
    var dir = './inbounds';
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
                  res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
                } 
              else
              {
                //console.log(list.length);
                  //console.log(list);
                  var filescounter=0;
                  if(list.length <= 0)
                  {
                    res.json({"Status":0,Msg:"Files Not Found !",Data:[]})
                  }
                for (let index = 0; index < list.length; index++) {
                    console.log(list[index]);
                    if((list[index].type!=="d")){
                        //console.log(filelist.push(list[index].name));

                        filescounter++;
                        console.log(list[index].name);
                        console.log("folder path found "+folderpath+'/'+list[index].name);
                          var content='';
                          ftp.get(folderpath+'/'+list[index].name, function(err, stream) {
                            //console.log(date.getTime());
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
                            //stream.once('close', function() { ftp.end(); });
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
                  res.json({"Status":0,Msg:"Files Not Found !",Data:[]});
                  ftp.end();
                }
                else
                {
                  res.json({Status:1,Msg:"Inbound File Saved",Data:[]});
                  ftp.end();
                }
              }
                
            });
            
        })
        ftp.connect(settings);
    
  });
    //this.responseText = JSON.stringify({status:1,data:body});
  //res.json({"status":1,Msg:"call",data:reso});
});
router.post('/outboundrun',function(req,res){
  var project_id = req.body.project_id;
  var project_code = req.body.project_code;
  console.log(project_id);
  var directoryPath= 'inbounds/'+project_id;
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
        "${defaultValue}",
        1,
        number(not(text())) * string-length("${defaultValue}")
    )
    )`
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
          Brand:textOrDefault('boden'),
          SupplierNo:'SupplierNo',
          FactoryNo:'FactoryNo'
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
  
        OrderHandeling:[
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
            Brand:textOrDefault(project_code),
            SupplierNo:'ID',
            FactoryNo:'Data'
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
    var dir = './history/inbounds';
    var out_dir ='./history/outbounds';
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

              const result = await transform(xml, template2);
              var data = result;
              data[0].SupplierDetail.push({Brand:project_code});
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
              //console.log(data[0].SupplierDetail);
              //res.json({status:"1",Msg:"TUU XML File Converted Successfully",Data:data});
              if(result.length!==0)
              {
                console.log(api_url);
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
                        console.log(response);
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
                          console.log(error);
                        }
                        else if(dataoutboundres==undefined)
                        {
                          //res.send({"Status":"false","Msg":"Wrong API Call"});
                        }
                        else
                        {
                          var dataoutboundres = JSON.parse(response.body);
                          console.log(dataoutboundres);
                          if(dataoutboundres.SaveType=="Success")
                          {
                            //outbound_run_counter_success=parseInt(outbound_run_counter_success+1);
                          }
                          else
                          {
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
                //var filenames = parseInt(crypto.randomBytes(2).toString('hex'), 16)+'.json';
                var filenames = file.split('.').slice(0, -1).join('.')+'.json';
                console.log(filenames);
                const writefile = fs.writeFileSync(out_month_folder+'/'+filenames,JSON.stringify(result));
                /* fs.rename(directoryPath+'/'+file, month_folder+'/'+file, function (err) {
                  if (err){
                    console.log(err);
                  } //throw err
                  //console.log('Successfully renamed - AKA moved!');
                }) */
                //console.log("\nFile Contents of hello.txt:",
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
                    // handle the error
                  }
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
  });
    
  res.json({Status:1,Msg:"outboundrun successfull"});
});
router.post('/testfiles',function(req,res){
  var project_id = req.body.project_id;
  //console.log(project_id);
  var directoryPath= 'inbounds/'+project_id;
  // make project/date wise folder
  var date = new Date();
  var dir = './history/inbounds';
  var out_dir ='./history/outbounds';
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
/* router.post('/convertxmltojson',function(req,res){
  let xml_string = req.body.xml_content;
  xml_string = xml_string.replace(/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->)(.|\n))*-->/g,"");
  //let xml_string = fs.readFileSync("./inbounds/myxml_data.xml", "utf8");
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
        "${defaultValue}",
        1,
        number(not(text())) * string-length("${defaultValue}")
    )
)`
   const xml = '`'+xml_string+'`';
    console.log("xml" + xml);
    
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
            Brand:textOrDefault('boden'),
            SupplierNo:'SupplierNo',
            FactoryNo:'FactoryNo'
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
              res.json({status:"1",Msg:"TUU XML File Converted Successfully",Data:result});
            }catch(err)
            {
              console.log(err);
            }
            //console.log(JSON.stringify(result));
        
            //const prettyStr = await prettyPrint(xml, { indentSize: 4})
            //console.log(prettyStr)
        })()
}) */
router.post('/convertxmltojson',function(req,res){
  let xml_string = req.body.xml_content;
  xml_string = xml_string.replace(/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->)(.|\n))*-->/g,"");
  //let xml_string = fs.readFileSync("./inbounds/myxml_data.xml", "utf8");
  //console.log(xml_string);
  const textOrDefault = (defaultValue) => `concat(
    text(),
    substring(
        "${defaultValue}",
        1,
        number(not(text())) * string-length("${defaultValue}")
    )
)`
   const xml = '`'+xml_string+'`';
    //console.log("xml" + xml);
      
      const template = ['//WebOrder',{
  
        OrderHandeling:[
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
            Brand:textOrDefault('boden'),
            SupplierNo:"ID",
            FactoryNo:"Data"
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
            
            
            // name: 'String(name)',
            // jerseyNumber: '@jerseyNumber',
            // yearOfBirth: 'number(yearOfBirth)',
            // isRetired: 'boolean(isRetired = "true")'
        
        
        ;(async function () {
            try{

              const result = await transform(xml, template)
              var data = result;
              //data[0].SupplierDetail.push({"Brand":"boden"});
              // if(data[0].EDISizeDetail.EDISize.length > 0 )
              // {
              //   console.log("edisize detail found");
              // }
              // else
              // {
              //   console.log(data[0].SupplierDetail);
              //   console.log(data[0].EDISizeDetail.EDISize.length);
              // }
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

module.exports = router;
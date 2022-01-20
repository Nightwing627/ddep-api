var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const crypto = require('crypto');
const { transform, prettyPrint } = require('camaro');
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
  console.log(req.body.project_id);
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
    var settings = {
      host:inboundSetting.ftp_server_link ,
      user:inboundSetting.login_name,
      password:inboundSetting.password,
      port:inboundSetting.port,
      secure:true,
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
                console.log(list.length);
                  var filescounter=0;
                  if(list.length <= 0)
                  {
                    res.json({"Status":0,Msg:"Files Not Found !",Data:[]})
                  }
                for (let index = 0; index < list.length; index++) {
                    if((list[index].type!=="d")){
                        //console.log(filelist.push(list[index].name));
                        filescounter++;
                          var content='';
                          ftp.get(folderpath+'/'+list[index].name, function(err, stream) {
                            console.log(list[index].name);
                            //console.log(date.getTime());
                            if (err)
                            {
                              console.log("error in "+list[index].name);
                            }
                            else
                            {
                              
                              var name = parseInt(crypto.randomBytes(2).toString('hex'), 16); //parseInt(date.getTime() + 1);
                              console.log(name);
                              stream.pipe(fs.createWriteStream(dir+'/'+projectdir+'/'+name+'.xml'));
                              ftp.rename(folderpath+'/'+list[index].name,folderpath+'/'+backup_folder+'/'+list[index].name,function(err){
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
                }
                else
                {
                  res.json({Status:1,Msg:"Inbound File Saved",Data:[]});
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

              const result = await transform(xml, template);
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
                        'TuuJson':JSON.stringify(result)
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
                var filenames = parseInt(crypto.randomBytes(2).toString('hex'), 16)+'.json';
                const writefile = fs.writeFileSync(out_month_folder+'/'+filenames,JSON.stringify(result));
                fs.rename(directoryPath+'/'+file, month_folder+'/'+file, function (err) {
                  if (err) throw err
                  //console.log('Successfully renamed - AKA moved!');
                })

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
module.exports = router;
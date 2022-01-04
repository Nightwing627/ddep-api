var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
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
router.get('/ftpconnectiontest',function(req,res){
 

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
            c.get('home/TUU_XML/TUU_sample 1.xml', function(err, stream) {
                 
                 stream.on('data', function(chunk) {
                     content += chunk.toString();
                 });
                 stream.on('end', function() {
                     // content variable now contains all file content. 
                     console.log(content);
                 });
            });
        });
  const xml = '`'+content+'`';
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
              Brand:'Brand || ""',
              SupplierNo:'SupplierNo',
              FactoryNo:'FactoryNo'
            }
           ],
           ItemRefs:[
            '//POHeader/ItemRefs/Variable',
            {
              ItemRef:'ItemRef',
              
            }
           ],
           EDI_Variables:[
            '//EDIHeader/EDI_Variables/Variable',
            {
              ID:'EDI_HName',
              value:'EDI_HValue'
              
            }
           ],
          //  FibreComponetName:[
          //   '//EDIHeader/EDI_CareandContent/Fibre/FibreComponet/FibreComponentName',
          //   {
          //     FibreComponentName:'FibreComponentName',
          //     //FibrePercent:'FibrePercent'
          //   }
          //  ],
           FibreComponet:[
            '//EDIHeader/EDI_CareandContent/Fibre/FibreComponet/Variable',
            {
              FibreComponentName:'//EDIHeader/EDI_CareandContent/Fibre/FibreComponet/FibreComponentName',
              FibreNane:'FibreName',
              FibrePercent:'FibrePercent'
            }
           ],
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
        
          const result = await transform(xml, template)
          console.log(JSON.stringify(result));
      
          //const prettyStr = await prettyPrint(xml, { indentSize: 4})
          //console.log(prettyStr)
          res.json({status:"1",Data:result});
      })()
      
      //res.json({status:"1",Data:"result"});
})

module.exports = router;
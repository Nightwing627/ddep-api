var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const ftp = require('../my_modules/FTPClient');
const config = require('../config/default');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const outbound = require('../controllers/outbound.controller.js');
const { $where } = require('../models/schedule_setting.model');
const e = require('express');
const { json } = require('body-parser');
const { exit } = require('process');
router.post('/run', outbound.create);
router.put('/:id',outbound.update);
router.post('/runbyuser',function(req,res){
    var options = {
        'method': 'POST',
        'url': config.domain+'/outbound/run',
        'headers': {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "project_code": "001",
          "project_id": "616ecacb5593bb6f186bb05c",
          "outbound_data": {
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
router.post('/useroutboundtest',function(req,res){
  var project_id = req.body.project_id;
  var api_url = req.body.api_url;
  let outbound_run_counter_success = 0;
  let outbound_run_counter_fail = 0;
  var options = {
    'method': 'POST',
    'url': config.domain+'/inbound/findbyproject_id',
    'headers': {
      'Content-Type':'application/json'
    },
    body:JSON.stringify({"project_id":project_id}),
  }
  request(options, function (error, response) {
    if (error){
      throw new Error(error);
    }
    else
    {
      var inbound_data_array = JSON.parse(response.body);
      var data_array = [];
      inbound_data_array.data.forEach(item => {
        data_array.push(item.inbound_data);
      });
      //res.send(data_array);
      //res.send(inbound_data_array);
      
      data_array.forEach(item =>{

        var options1 = {
          'method': 'POST',
          'url': api_url,
          'headers': {
            'Content-Type': 'text/plain'
          },
          formData:{
            'TuuJson':JSON.stringify(item)
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

            }
            if (error){
              //throw new Error(error);
              //res.end({"Status":"false","Msg":"Wrong API Call"});
              
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
                
                outbound_run_counter_success=parseInt(outbound_run_counter_success+1);
              }
              else
              {
                outbound_run_counter_fail=parseInt(outbound_run_counter_fail+1);
  
              }
              
              //console.log(JSON.parse(response.body));
              //console.log(outbound_run_counter_fail);
            }
          }catch(error)
          {
            console.log(error);
          }
      })
    })
    
    }
  });
  //console.log(outbound_run_counter_fail); 
  res.json({"Status":"1","Msg":"Outbound Run Successfully"});
});


module.exports = router;
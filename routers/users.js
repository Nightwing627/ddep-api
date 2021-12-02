var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
const multer  = require('multer')
const upload = multer()
var FormData = require('form-data');
const ase = require('../my_modules/aes');
router.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const users = require('../controllers/user.controller.js');
const role = require('../controllers/role.controller.js');
const staf_role = require('../controllers/staff_role.controller.js');
const menufunc_access_right = require('../controllers/menufunc_access_right.controller.js');
const menufunc = require('../controllers/menufunc.controller.js');
const branch = require('../controllers/branch.controller.js');
const department = require('../controllers/department.controller.js');
const staff_branch = require('../controllers/staff_branch.controller.js');
const staff_department = require('../controllers/staff_department.controller.js');
const { json } = require('body-parser');
router.post('/sync-user', users.create);
router.post('/role',role.create);
router.post('/staffrole',staf_role.create);
router.post('/menuaccessright',menufunc_access_right.create);
router.post('/menufunc',menufunc.create);
router.post('/branch',branch.create);
router.post('/department',department.create);
router.post('/staff_branch',staff_branch.create);
router.post('/single-staff-branch',staff_branch.findOne);
router.post('/single-user',users.findOne);
router.post('/single-role',role.findOne);
router.post('/single-staf_role',staf_role.findOne);
router.post('/single-menufunc_access_right',menufunc_access_right.findOne);
router.post('/single-menufunc',menufunc.findOne);
router.post('/single-branch',branch.findOne);
router.post('/single-department',department.findOne);
router.post('/single-staff_department',staff_department.findOne);
router.post('/staff_department',staff_department.create);
router.get('/list',users.findAll);
router.get('/user-list',function(req,res){
      res.render('pages/users');
});
router.put('/:id',users.update);
router.put('/branch/:id',branch.update);
router.put('/department/:id',department.update);
router.put('/role/:id',role.update);
router.put('/menuaccessright/:id',menufunc_access_right.update);
router.put('/staffrole/:id',staf_role.update);
router.put('/menufunc/:id',menufunc.update);
router.put('/branch/:id',branch.update);
router.put('/staff_branch/:id',staff_branch.update);
router.put('/staff_department/:id',staff_department.update);

router.get('/userajax',function(req,res){  
})

router.post('/syncuser',upload.none(),function(req,res,next){
      var Aes = new ase();
      var jsondata = req.body;
      var http_req = req.protocol+'://';
      const host = req.get('host');
    const origin = req.get('origin');
    
      
     //console.log(req.secure);
    var post_data_s = Aes.Decrypt(unescape(jsondata.SyncData));
    
    var syncjson = eval("("+post_data_s+")");
    //console.log(syncjson[0].tbl_staff);
    var counter = 0;
    syncjson.forEach(tablelist => {
          console.log("decryped value successfully step 1");
         tablelist.tbl_staff.forEach(item => {
           console.log("tbl_staff loop searching for exsting record step 2");
            var options = {
                  'method': 'POST',
                  'url': http_req+req.headers.host+'/users/single-user',
                  'headers': {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({"id":item.user_name})
                
                };
                console.log("sending request on");
                console.log(options);
                request(options, function (error, response) {
                  console.log(error);
                  console.log(response);
                  if (error) {
                    console.log("error in find record staff_tbl step 3");
                    throw new Error(error);
                  }
                  
                  if(response.statusCode==200)
                  {
                        var result = JSON.parse(response.body);
                        if(result.status)
                        {
                              console.log("calling update staff record step 4");
                              var options = {
                                    'method': 'PUT',
                                    'url': http_req+req.headers.host+'/users/'+result.data,
                                    'headers': {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(item)
                                  
                                  };
                                  request(options, function (error, response) {
                                    if (error){

                                      console.log(error);//throw new Error(error);
                                    } 
                                    //console.log(response);
                                    if(response.statusCode==200)
                                    {
                                      console.log("update record staff tbl step 5");  
                                      //counter = eval(counter+1);
                                          //console.log(counter);
                                    }
                                    else
                                    {
                                      console.log("updation fail staff tbl step 6");
                                      console.log(error);
                                    }
                                  });  
                        }
                        else
                        {
                            console.log("calling insert new value for staff tbl step 7");
                              var options = {
                                    'method': 'POST',
                                    'url': http_req+req.headers.host+'/users/sync-user',
                                    'headers': {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(item)
                                  
                                  };
                                  request(options, function (error, response) {
                                    if (error)
                                    {
                                      console.log("error in valule insert step 8"+ error);
                                      throw new Error(error);
                                    } 
                                    //console.log(response);
                                    if(response.statusCode==200)
                                    {
                                        console.log("staff tbl value inserted step 9");
                                          //counter = eval(counter+1);
                                          //console.log(counter);
                                    }
                                    else
                                    {
                                      console.log(error);
                                    }
                                  });
                        }
                        //counter = eval(counter+1);
                        //console.log(counter);
                  }
                });   
            
            
         });
         if(tablelist.tbl_role!=undefined)
         {
               
            
               tablelist.tbl_role.forEach(item => {
                     
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-role',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                var options = {
                                      'method': 'PUT',
                                      'url': http_req+req.headers.host+'/users/role/'+result.data,
                                      'headers': {
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(item)
                                    
                                    };
                                    request(options, function (error, response) {
                                      if (error) throw new Error(error);
                                      //console.log(response);
                                      if(response.statusCode==200)
                                      {
                                            //counter = eval(counter+1);
                                            //console.log(counter);
                                      }
                                      else
                                      {
                                        console.log(error);
                                      }
                                    });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/role',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                     
                  
               }); 
         } 
         if(tablelist.tbl_staffrole!=undefined)
         {

               tablelist.tbl_staffrole.forEach(item => {

                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-staf_role',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/staff_role/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/staffrole',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tb_menufunc_access_right!=undefined)
         {

               tablelist.tb_menufunc_access_right.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-menufunc_access_right',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/menuaccessright/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/menuaccessright',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tb_menufunc!=undefined)
         {

               tablelist.tb_menufunc.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-menufunc',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/menufunc/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/menufunc',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tbl_branch!=undefined)
         {

               tablelist.tbl_branch.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-branch',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/branch/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/branch',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tbl_department!=undefined)
         {

               tablelist.tbl_department.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-department',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/department/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/department',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tbl_staff_branch!=undefined)
         {

               tablelist.tbl_staff_branch.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-staff-branch',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/staff_branch/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/staff_branch',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         if(tablelist.tbl_staff_department!=undefined)
         {

               tablelist.tbl_staff_department.forEach(item => {
                  var options = {
                        'method': 'POST',
                        'url': http_req+req.headers.host+'/users/single-staff_department',
                        'headers': {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"id":item.id})
                      
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                        //console.log(response);
                        if(response.statusCode==200)
                        {
                              var result = JSON.parse(response.body);
                              if(result.status)
                              {
                                    var options = {
                                          'method': 'PUT',
                                          'url': http_req+req.headers.host+'/users/staff_department/'+result.data,
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                //counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              else
                              {
                                    var options = {
                                          'method': 'POST',
                                          'url': http_req+req.headers.host+'/users/staff_department',
                                          'headers': {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify(item)
                                        
                                        };
                                        request(options, function (error, response) {
                                          if (error) throw new Error(error);
                                          //console.log(response);
                                          if(response.statusCode==200)
                                          {
                                                counter = eval(counter+1);
                                                //console.log(counter);
                                          }
                                          else
                                          {
                                            console.log(error);
                                          }
                                        });
                              }
                              //console.log(counter);
                        }
                      });
                  
               }); 
         } 
         
    });
    res.json({"status":"1","msg":"Records Saved successfully"});
})
module.exports = router;
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
router.get('/testsync',function(req,res){
      var myobj ={
            "enable_fg":true,
            "two_auth_fg":true,
            "user_name":"vijay",
            "display_name":"vijayvadher",
            "email":"vijay@gmail.com",
            "staff_other_code":"1234455",
            "first_name":"vijay",
            "last_name":"vadher",
            "Local_lang_name":"eng",
            "skype_address":"",
            "title":"",
            "tel_city_idd":"1",
            "tel":"987654321",
            "fax_country_idd":"1",
            "fax_city_idd":"1",
            "fax":"1234567890",
            "country":"ch",
            "state":"bj",
            "city":"abc",
            "postal_code":"123456",
            "address1":"test address",
            "address2":"",
            "address3":"",
            "mobile_country_idd":"1",
            "mobile_city_idd":"1",
            "mobile":"1234567890"
      }
      var realdata = 'X1XCsbecCqhLnvQ2lHTUfGx6bMrVJ0kO0FrWpVkCKpVjcL%2bqpxgNjIgAOEwljUGnIO1BvGHBehVwmfdAO5TTwZEJEN2yQWMcEcDHwmNrr4qZuHC3Tz9BfYJlwKWnIfzzBDC0oV0g6QPR0VvfeNVgd2BcuZVtf7JY%2f8TG4bwnxALviY8ZImFrb4ntJRtjr93mrC7F2K7jUopHIgUvmqkOGbDo2rWZYjTp0l3ux4JJ8ZPM97PGba6bcUOOds4hJY9yi%2fxSXZBw0GyTyV89zP861fyFy6ZBIXayl6j88YY5wgF%2fyDmzmQWU167biXNBKhktW7OYeSk31rhflvLbtPSRg2yePs5c%2bNPM%2f2wtiRhtHYPMo0DojlEv%2f5Zd%2frvmQKlNQaHwHoPqWggHFXlAdz2CDZ%2fjbllXTJTfPJPzquwCBegYgxg%2fU%2fqGr2VBExPE4%2b94f5MM0ZvGqzQXvuDRRKCkGO5VMYoQc3RXxbqXMnhYAFE0kpHpBuHHtRmpGa6vkfOaoUZ3vZCe90w0VktrXE0IMgI9Fi2jAHycSX0jf%2bKiTuDaqI3cpybu1SpIxk5UEqwPYENHFsi1xVrxNnTzwcUXOelpk%2bpUac4tZGvh%2bq1C6gqDFQZ89JF%2bDYA1%2bfHFtgBrdswQDSVKeaBVj0UZr%2fxr0tKQYSwCZQ%2fa2i7hAQO33Uc%2bVWPZfPXRbKHu5Knqs5kk8fzZsepidfX6f07KpeFZQdE%2fj9wKOVbbh6xeoj6tgsN3hOv6b4bJ%2fFIvp2FcDHMvaxaZjdfUK71Szt0xpD0owfMFSvrL%2btCb1M2NVE87KE8HSyQaL1VOBH67Q9XwcSiM80qLDvHK4lUKResozZ%2fJFnW4E7Wbagxkk3C1AJuPl%2bFNCqy3tHL4%2fDceDceGQ9lJi8I9PJdXBBdcp1Bdggyn89E27m2XzfcSEsnyePFHUzng8RkB8ewOOX5Si7vAcAmhkaCOn1V6owDGNFsqt3f3fGA2QqoJZLqz2A2ovLwCIMI5CgCc4ZPUw1HLmSz4DXxu6apNGdXp6TtKmKUakQEUiI7I5fDtCG0ySTXro5aIYQxEtxWUJP1fzPFulEYHmHML2vYY1QP4%2fzvGlCq1kw%2bvHdkILaGwPaHKxfnZ9rYV%2fc7gsHcZTDxpOHHAbqqqkRtT%2fWUS3M5%2fXYr3HvXGEzzwdQjvjUEblIUm8mGObpPAPGX7TdKwaeyu47wLpQ4QGu%2bk0XRLL3V4ehLAzkxuz0K1RFDumGLGQCA5Tm6egNKJsUCd7X6XrwSMmZ2kXrwB%2fmCOEfvb%2ftjXBRas7tbbt6NowuytJ6FNAcjBb8Zkz1AO1F63Q5dGw9qCWRWgBSXsRbDv92TtBjkWEdyfsgKa0839kNKk%2fF2CiOnOCrZ%2fcPhlRXBCVkQ7c%2bSucz3hj9dawq51RQHa%2fdYMwExrpj2V8WAsN1ty4x6FeU0TDCsyZJXDoWELsvEBqpm7hbHvt6ap84qsD3v5b1bRldTbXfpOPXJztblUJtCvxem3%2bA8KSkUI3n9mOoQX1OM7FSXmHOMBAyqqk%2boxjPxo4C2FYUPb66N0qnISlEA%2fq0EyFjZOny4pkfNidEUuHpddt4of%2bM%2fXRmv%2f2zn5hs1i0N8Io4o5Ykm%2bHAvVyUolEi5bWqP0OG6i%2blFZn%2b9e1fI3WgYv0lJ8Z%2fbemUM%2bqit6YVGy3mwDJeaLb6ltVQ6MzPIVci691wJTYcH2867yLo6BqVuQ4BCb9kf6qorB5RXkxgXRpJBlHoItLr%2bqYrDVC83yw6TZ15A%2b4r6xUAYC2tFqTwoPXctBUj4L3krqVTKlScpDlJVkgQTDFqDf1X5PGiQK72uGoOnyQ7I%3d'
      var Aes = new ase();
      var jsonstring = JSON.stringify(myobj);
      console.log(Aes.Encrypt(jsonstring));
      res.json("run successfully");
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
         tablelist.tbl_staff.forEach(item => {
            var options = {
                  'method': 'POST',
                  'url': http_req+req.headers.host+'/users/single-user',
                  'headers': {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({"id":item.user_name})
                
                };
                request(options, function (error, response) {
                  if (error) throw new Error(error);
                  
                  if(response.statusCode==200)
                  {
                        var result = JSON.parse(response.body);
                        if(result.status)
                        {
                              var options = {
                                    'method': 'PUT',
                                    'url': http_req+req.headers.host+'/users/'+result.data,
                                    'headers': {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(item)
                                  
                                  };
                                  request(options, function (error, response) {
                                    if (error) console.log(error);//throw new Error(error);
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
                                    'url': http_req+req.headers.host+'/users/sync-user',
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
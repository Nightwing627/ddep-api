var express =   require("express");
var multer  =   require('multer');
var xml = require("xml2js");
let fs = require('fs');

var app         =   express();
var path = require('path');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');

  app.get('/dashboard', function(req, res) {
    res.render('pages/dashboard-analytics');
  });
  app.get('/template', function(req, res) {
    res.render('pages/add-template');
  });
  app.get('/',function(req,res){
    res.render('pages/login');
  })
 
app.listen(8004,function(){
    console.log("Working on port 8004");
});
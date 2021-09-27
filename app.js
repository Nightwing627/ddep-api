var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var indexRouter = require('./routers/index');
var usersRouter = require('./routers/users');
var projectsRouter = require('./routers/projects');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/projects',projectsRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });
  //error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
  });
  
  const port = process.env.PORT || 3000;
  
  app.listen(port, function () {
    console.log('Server is running on PORT',port);
  });
  mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
  }).then(() => {
      console.log("Successfully connected to the database");    
  }).catch(err => {
      console.log('Could not connect to the database. Exiting now...', err);
      process.exit();
  });
  module.exports = app;
  
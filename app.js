process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var request = require('request');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');
var cron = require('node-cron');
mongoose.Promise = global.Promise;
var indexRouter = require('./routers/index');
var usersRouter = require('./routers/users');
var projectsRouter = require('./routers/projects');
var inboundSettingRouter = require('./routers/inbound_setting');
var outboundSettingRouter = require('./routers/outbound_setting');
var scheduleSettingRouter = require('./routers/schedule_setting');
var inboundRouter = require('./routers/inbound');
var outboundRouter = require('./routers/outbound');
var scheduler_job = require('./routers/scheduler_job');
var app = express();
var axios = require('axios');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.text({
  type: '*'
}));
app.use(express.urlencoded({ extended: true }));

//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/projects',projectsRouter);
app.use('/inbound_setting',inboundSettingRouter);
app.use('/outbound_setting',outboundSettingRouter);
app.use('/schedule_setting',scheduleSettingRouter);
app.use('/inbound',inboundRouter);
app.use('/outbound',outboundRouter);
app.use('/scheduler_job',scheduler_job);
//const host = req.get('host');
const http_req = "http://";
const host='localhost:8004';

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
//   request(http_req+req.headers.host+'/scheduler_job/getScheduleProjectInfo/', function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             //console.log('im ok');
//             console.log(body) // Show the HTML for the Google homepage.
//         }
//         console.log(error);
//     });
// });

app.use(function(req, res, next) {
    next(createError(404));
    //host = req.get('host');
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
  
  const port = process.env.PORT || 8004;
  
  app.listen(port, function () {
    console.log('Server is running on PORT',port);
    //console.log(host);
  });
  
  if(host!="localhost:8004")
  {
    http_req="https://";
  }
  function calltestfun()
  {
      axios.get("http://localhost:8004"+'/scheduler_job/getScheduleProjectInfo/')
      .then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });
  }
// cron.schedule('* * * * *',()=>{
//   console.log("run by schedule every minit");
//     calltestfun();
// });
  mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    
    
  }).then(() => {
      console.log("Successfully connected to the database");    
  }).catch(err => {
      console.log('Could not connect to the database. Exiting now...', err);
      process.exit();
  });
  
  module.exports = app;
  
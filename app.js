process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var request = require('request');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const dbConfig = require('./config/db.config.js');
const config = require('./config/default');
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
var inboundHistoryRouter = require('./routers/inbound_history');
var outboundHistoryRouter = require('./routers/outbound_history');
var TemplateRouter = require('./routers/templates');
var MappingRouter = require('./routers/mapping');
var project = require('./routers/project');
const monitorClass = require('./monitor/monitor.js');

var monitor = new monitorClass();

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
//app.use('/project/item',projectsRouter);
app.use('/inbound_setting',inboundSettingRouter);
//app.use('/project/item/inbound',inboundSettingRouter);
app.use('/outbound_setting',outboundSettingRouter);
//app.use('/project/item/outbound',outboundSettingRouter);
app.use('/schedule_setting',scheduleSettingRouter);
//app.use('/project/item/schedule',scheduleSettingRouter);
app.use('/inbound',inboundRouter);
//app.use('/project/item/inbound',inboundRouter);
app.use('/outbound',outboundRouter);
app.use('/scheduler_job',scheduler_job);
//app.use('/project/item/scheduler_job/',scheduler_job);
app.use('/inbound_history',inboundHistoryRouter);
//app.use('/project/item/inbound_history',inboundHistoryRouter);
app.use('/outbound_history',outboundHistoryRouter);
//app.use('/project/item/outbound_history',outboundHistoryRouter);
app.use('/templates',TemplateRouter);
app.use('/project',project);
//app.use('/project/item/mapping',MappingRouter);
//const host = req.get('host');
//app.use(express.urlencoded({ extended: true }));

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
  
  const port = process.env.PORT || 8014;
  
  app.listen(port, function () {
    console.log('Server is running on PORT',port);
    //console.log(host);
  });
  
  
  
  function calltestfun()
  {
      axios.get(config.domain+'/scheduler_job/getScheduleProjectInfo/')
      .then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });
      
  }
  function calltestfun2()
  {
      axios.get(config.domain+'/scheduler_job/scheduling/')
      .then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });
      
  }
cron.schedule('* * * * *',()=>{
  console.log("run by schedule every minit");
    calltestfun2();
});

cron.schedule("0 0 0 * * *", function() {
  monitor.logFileCleanUp();
  console.log("running a task every day 00:00 hours");
});

  mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    
    
  }).then(() => {
      console.log("Successfully connected to the database");    
      // monitor.exceptionErrorStore('error_page', 'error_module', 'error_info', 'error_url', 'error_http_status_code', 'error_username', 'error_company_code');
  }).catch(err => {
      console.log('Could not connect to the database. Exiting now...', err);
      monitor.databaseConnectError('app.js', 'database connect', 'Vijay', err);
      process.exit();
  });
  
  module.exports = app;
  

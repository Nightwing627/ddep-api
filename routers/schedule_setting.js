var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const schedule_setting = require('../controllers/schedule_setting.controller.js');
router.post('/save', schedule_setting.create);
router.put('/:id',schedule_setting.update);
router.get('/editAPI/:id',schedule_setting.findOne);
// router.get('/add',function(req,res){
//     res.render('pages/add-projects');
// })
router.get('/list',schedule_setting.findAll);
router.put('/update/:id',schedule_setting.update);

// router.get('/project-list',function(req,res){
//     res.render('pages/list-project');
// });
router.get('/getnextdate',function(req,res){
    
    //res.json({"status":"1","msg":"run method successfully"});
});

module.exports = router;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const inbound_setting = require('../controllers/inbound_setting.controller.js');
router.post('/save', inbound_setting.create);
router.put('/:id',inbound_setting.update);
router.get('/editAPI/:id',inbound_setting.findOne);
// router.get('/add',function(req,res)+
//     res.render('pages/add-projects');
// })
router.get('/list',inbound_setting.findAll);
router.put('/update/:id',inbound_setting.update);
// router.get('/project-list',function(req,res){
//     res.render('pages/list-project');
// });



module.exports = router;
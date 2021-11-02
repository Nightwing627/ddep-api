var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const outbound_setting = require('../controllers/outbound_setting.controller.js');
router.post('/save', outbound_setting.create);
router.put('/:id',outbound_setting.update);
// router.get('/add',function(req,res){
//     res.render('pages/add-projects');
// })
router.get('/list',outbound_setting.findAll);
// router.get('/project-list',function(req,res){
//     res.render('pages/list-project');
// });



module.exports = router;
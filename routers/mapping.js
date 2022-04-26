var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const mapping = require('../controllers/mapping.controller.js');
const mapping_inbound_upload = require('../controllers/mapping_inbound_upload.controller.js');
const mapping_outbound_upload = require('../controllers/mapping_outboud_upload.controller.js');
router.post('/save', mapping.create);
router.put('/:id',mapping.update);
router.get('/editAPI/:id',mapping.findOne);
// router.get('/add',function(req,res){
//     res.render('pages/add-mapping');
// })
router.get('/list',mapping.findAll);
router.put('/update/:id',mapping.update);
router.delete('/delete/:id',mapping.delete);
router.post('/inbound/upload',mapping_inbound_upload.create);
router.post('/outbound/upload',mapping_outbound_upload.create);
// router.get('/template-list',function(req,res){
//     res.render('pages/list-template');
// });

module.exports = router;
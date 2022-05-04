var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
const multer = require('multer');
//router.use(express.urlencoded({ extended: false }));
//router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
router.use(express.urlencoded({ extended: false }));
router.use(bodyParser.urlencoded({ extended: false }))
const mapping = require('../controllers/mapping.controller.js');
const mapping_inbound_upload = require('../controllers/mapping_inbound_upload.controller.js');
const mapping_outbound_upload = require('../controllers/mapping_outbound_upload.controller.js');
const storage = multer.diskStorage({
    destination: './output/uploads/'
});
const upload = multer({
    storage: storage,
    //limits: { fileSize: 1000000 },
    
});
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
router.post('/inbound/upload_file',upload.single('file'),mapping_inbound_upload.upload);
router.post('/outbound/upload_file',upload.single('file'),mapping_outbound_upload.upload);
// router.get('/template-list',function(req,res){
//     res.render('pages/list-template');
// });

module.exports = router;
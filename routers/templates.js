var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//app.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static('public'));
const templates = require('../controllers/templates.controller.js');
router.post('/save', templates.create);
router.put('/:id',templates.update);
router.get('/editAPI/:id',templates.findOne);
router.get('/add',function(req,res){
    res.render('pages/add-template');
})
router.get('/list',templates.findAll);
router.put('/update/:id',templates.update);
router.delete('/delete/:id',templates.delete);
router.get('/template-list',function(req,res){
    res.render('pages/list-template');
});



module.exports = router;
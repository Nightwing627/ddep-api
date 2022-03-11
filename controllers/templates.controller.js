bodyParser = require('body-parser');
const Templates = require('../models/templates.model.js');

// Create and Save a new Note
function isJson(str) {
    try {
        JSON.parse(str);

    } catch (e) {
        return false;
    }
    return true;
}
exports.create = (req, res) => {
    var data = req.body;
    //var check =isJson(data);
    // if(!check)
    // {
    //     //data = JSON.parse(req.body);
    // }
    //var data = JSON.parse(req.body);

   //data = JSON.stringify(req.body);
   //data = JSON.parse(data);
   var checkinbound =isJson(data);
   
   if(checkinbound)
   {

       data.Templates = JSON.parse(data);
   }
    if(!data.TemplateCode) {
        return res.status(400).send({
            message: "Template Code Required"
        });
    }
    if(!data.TemplateName) {
        return res.status(400).send({
            message: "Template Name Required"
        });
    }
    if(!data.TemplateType) {
        return res.status(400).send({
            message: "Template Type Required"
        });
    }
    
    const templatesdata = new Templates({
        TemplateCode:data.TemplateCode,
        TemplateName:data.TemplateName,
        TemplateType:data.TemplateType,
        isActive:data.isActive||'InActive',
    });
    templatesdata.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({id:data._id,msg:"Templates Saved Successfully"});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    //var page =req.query.page;
    //var limit =eval(req.query.limit);
   //console.log(limit*page);
   Templates.find()
    .then(Templates => {
        res.status(200).send({data:Templates})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = Templates.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;
    Templates.findOne({"_id":id})
    .then(data => {
      if (!data)
        res.status(404).json({ message: "Not found Template with id " + id });
      else res.json(data);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error retrieving Template with id=" + id });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    var data = req.body;
    //var check =isJson(data);
    // if(!check)
    // {
    //     //data = JSON.parse(req.body);
    // }
    //var data = JSON.parse(req.body);

   //data = JSON.stringify(req.body);
   //data = JSON.parse(data);
   var checkinbound =isJson(data);
   
   if(checkinbound)
   {

       data = JSON.parse(data);
   }
   
   
    
    /* if(!data.TemplateCode) {
        return res.status(400).send({
            message: "Template Code Required"
        });
    }
    if(!data.TemplateName) {
        return res.status(400).send({
            message: "Template Name Required"
        });
    }
    if(!data.TemplateType) {
        return res.status(400).send({
            message: "Template Type Required"
        });
    } */

    Templates.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((Templates) => {
        //console.log(req.params.id);
      if (!Templates) {
        res.json({"Status":"0","Msg":"Not Updated Successfully","ErrMsg":"","Data":[]});
      }
      res.json({"Status":"1","Msg":"Updated Successfully","ErrMsg":"","Data":[]});
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the Template",
        err:err
      });
    });

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Templates.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {

            res.json({"Status":"0","Msg":"","ErrMsg":err,"Data":[]});
        }
        else
        {
            res.json({"Status":"1","Msg":"Deleted Successfully","ErrMsg":"","Data":[]});

        }
    });
};
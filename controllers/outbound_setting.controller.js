bodyParser = require('body-parser');
const OutboundSetting = require('../models/outbound_setting.model.js');

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
   
   var checkoutbound =isJson(data);
  
   
   if(checkoutbound)
   {

       data = JSON.parse(data);
   }
   
   
    
    
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    if(!data.outbound_format) {
        return res.status(400).send({
            message: "Outbound Format is Required"
        });
    }
    /* if(!data.sync_type_out) {
        return res.status(400).send({
            message: "Synchronize Output Type is Required"
        });
    } */
    if(!data.api_url) {
        return res.status(400).send({
            message: "API URL is Required"
        }); 
    }
    
    const outboundSetting = new OutboundSetting({
        project_id:data.project_id,
        outbound_format: data.outbound_format, 
        sync_type_out: data.sync_type_out || "API",
        api_url: data.api_url ,
        is_active : data.is_active || "Inactive"
    });
    outboundSetting.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({id:data._id,msg:"Setting Saved Successfully"});
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
   OutboundSetting.find()
    .then(OutboundSetting => {
        res.status(200).send({data:OutboundSetting})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = OutboundSetting.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;

    OutboundSetting.findOne({"project_id":id})
    .then(data => {
      if (!data)
        res.status(404).json({ message: "Not found Project with id " + id });
      else res.json(data);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error retrieving Project with id=" + id });
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
   
   var checkoutbound =isJson(data.OutboundSetting);
   
   
   if(checkoutbound)
   {

       data.OutboundSetting = JSON.parse(data.OutboundSetting);
   }
   
   
    
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not found"
        });
    }
    if(!data.outbound_format) {
        return res.status(400).send({
            message: "Outbound Format is Required"
        });
    }
    /* if(!data.sync_type_out) {
        return res.status(400).send({
            message: "Synchronize Output Type is Required"
        });
    } */
    if(!data.api_url) {
        return res.status(400).send({
            message: "API URL is Required"
        });
    }
    
    const outboundSetting = new OutboundSetting({
        outbound_format: data.outbound_format, 
        sync_type_out: data.sync_type_out || "API",
        api_url: data.api_url,
        
    });
    OutboundSetting.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((OutboundSetting) => {
        //console.log(req.params.id);
      if (!OutboundSetting) {
        return res.status(404).send({
          message: "no Project found"
        });
      }
      res.status(200).send({
          message:"Setting Updated Successfully"
      });
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the Project",
        err:err
      });
    });

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    OutboundSetting.findByIdAndRemove(req.params.id,function(err){
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
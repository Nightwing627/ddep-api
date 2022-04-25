bodyParser = require('body-parser');
const mapping = require('../models/mapping.model.js');

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
   var checkmapping =isJson(data);
   
   if(checkmapping)
   {

       //data.InboundHistory = JSON.parse(data);
   }
    
    
    const Mapping = new mapping({
        item_code:data.item_code,
        company_code:data.company_code,
        inbound_format:data.inbound_format,
        inbound_file_url:data.inbound_file_url,
        inbound_content:data.inbound_content,
        outbound_format:data.outbound_format,
        outbound_file_url:data.outbound_file_url,
        outbound_content:data.outbound_content,
        mapping_list:data.mapping_list,
        is_active:data.is_active,
        createdBy:data.createdBy,
        updateBy:data.updateBy,
    });
    Mapping.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({
            code: "0",
            MsgCode: "10001",
            MsgType: "Save-Data-Success",
            MsgLang: "en",
            ShortMsg: "Save Successful",
            LongMsg: "The Mapping detail information was save successful",
            InternalMsg: "",
            EnableAlert: "No",
            DisplayMsgBy: "ShortMsg",
            msg: "Setting save successfully",
            id: data._id,
            Data: []
        });
    }).catch(err => {
        res.status(500).send({
            code: "1",
            MsgCode: "50001",
            MsgType: "Exception-Error",
            MsgLang: "en",
            ShortMsg: "Save Fail",
            LongMsg: err.message || "Some error occurred while createing the project.",
            InternalMsg: "",
            EnableAlert: "No",
            DisplayMsgBy: "LongMsg",
            message: err.message || "Some error occurred while creating the project.",
            Data: []
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    //var page =req.query.page;
    //var limit =eval(req.query.limit);
   //console.log(limit*page);
   Mapping.find()
    .then(Mapping => {
        res.status(200).send({data:Mapping})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = Mapping.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;
    InboundHistory.findOne({"item_id":id})
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
exports.lastOne = (req,res)=>{
    const id = req.params.id;
    InboundHistory.findOne({"item_id":id},{},{sort:{'createdAt':-1}})
    .then(data=>{
        if(!data)
        res.status(404).json({ message: "Not Found id " + id }); 
        else res.json(data);
    })
    .catch(err => {
        res
          .status(500)
          .json({ message: "Error retrieving history with id=" + id });
      });
}


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
   
   
    
    if(!data.item_id) {
        return res.status(400).send({
            message: "Item Not Found"
        });
    }

    Mapping.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((Mapping) => {
        //console.log(req.params.id);
      if (!Mapping) {
        return res.status(404).send({
          message: "History Not Updated"
        });
      }
      res.status(200).send({
          message:"Setting Update Successfully"
      });
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the History",
        err:err
      });
    });

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Mapping.findByIdAndRemove(req.params.id,function(err){
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
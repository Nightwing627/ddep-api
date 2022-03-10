bodyParser = require('body-parser');
const InboundHistory = require('../models/inbound_history.model.js');

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

       data.InboundHistory = JSON.parse(data);
   }
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    
    const inboundSetting = new InboundHistory({
        project_id:data.project_id,
        status:data.status
    });
    inboundSetting.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({id:data._id,msg:"History Saved Successfully"});
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
   InboundHistory.find()
    .then(InboundHistory => {
        res.status(200).send({data:InboundHistory})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = InboundHistory.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;
    InboundHistory.findOne({"project_id":id})
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
    InboundHistory.findOne({"project_id":id},{},{sort:{'createdAt':-1}})
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
   
   
    
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }

    InboundHistory.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((InboundHistory) => {
        //console.log(req.params.id);
      if (!InboundHistory) {
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
    InboundHistory.findByIdAndRemove(req.params.id,function(err){
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
bodyParser = require('body-parser');
const Inbound = require('../models/inbound.model.js');

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
    // var check =isJson(data);
    // if(!check)
    // {
    //     data = JSON.parse(req.body);
    // }
    //var data = JSON.parse(req.body);

   //data = JSON.stringify(req.body);
   //data = JSON.parse(data);
   
    if(!data.project_code) {
        return res.status(400).send({
            message: "Project Code Not Found"
        });
    }
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Id Not Found"
        });
    }
    
    const inbound = new Inbound({
        project_code: data.project_code, 
        project_id: data.project_id,
        inbound_data: data.inbound_data
        
    });
    inbound.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({Status:1,msg:"Inbound Run Successfully",Data:[]});
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
   Inbound.find()
    .then(inbound => {
        res.status(200).send({data:inbound})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = Inbound.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {

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
   if(!data.ProjectCode) {
    return res.status(400).send({
        message: "Project Code Not Found"
    });
}
if(!data.ProjectId) {
    return res.status(400).send({
        message: "Project Id Not Found"
    });
}

const inbound = new Inbound({
    ProjectCode: data.ProjectCode, 
    ProjectName: data.ProjectId,
    InboundData: data.InboundData
    
});
Inbound.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((inbound) => {
        //console.log(req.params.id);
      if (!inbound) {
        return res.status(404).send({
          message: "no Inbound found"
        });
      }
      res.status(200).send({
          message:"Inbound Update Successfully"
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
    Inbound.findByIdAndRemove(req.params.id,function(err){
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
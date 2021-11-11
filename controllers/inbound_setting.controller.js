bodyParser = require('body-parser');
const InboundSetting = require('../models/inbound_setting.model.js');

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

       data.InboundSetting = JSON.parse(data);
   }
   
    
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    if(!data.inbound_format) {
        return res.status(400).send({
            message: "Inbound Format is Required"
        });
    }
    if(!data.sync_type) {
        return res.status(400).send({
            message: "Select Syncronize Type"
        });
    }
    if(!data.ftp_server_link) {
        return res.status(400).send({
            message: "FTP URL is Required"
        });
    }
    if(!data.host) {
        return res.status(400).send({
            message: "Host Name is Required"
        });
    }
    if(!data.port) {
        return res.status(400).send({
            message: "Port Number is Required"
        });
    }
    if(!data.login_name) {
        return res.status(400).send({
            message: "Login Name is Required"
        });
    }
    if(!data.password) {
        return res.status(400).send({
            message: "Password is Required"
        });
    }
    
    const inboundSetting = new InboundSetting({
        project_id:data.project_id,
        inbound_format: data.inbound_format, 
        sync_type: data.sync_type,
        ftp_server_link: data.ftp_server_link,
        host: data.host,
        port: data.port,
        login_name: data.login_name,
        password: data.password
    });
    inboundSetting.save()
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
   InboundSetting.find()
    .then(InboundSetting => {
        res.status(200).send({data:InboundSetting})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = InboundSetting.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;

    InboundSetting.findOne({"project_id":id})
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
    if(!data.inbound_format) {
        return res.status(400).send({
            message: "Inbound Format is Required"
        });
    }
    if(!data.sync_type) {
        return res.status(400).send({
            message: "Select Syncronize Type"
        });
    }
    if(!data.ftp_server_link) {
        return res.status(400).send({
            message: "FTP URL is Required"
        });
    }
    if(!data.host) {
        return res.status(400).send({
            message: "Host Name is Required"
        });
    }
    if(!data.port) {
        return res.status(400).send({
            message: "Port Number is Required"
        });
    }
    if(!data.login_name) {
        return res.status(400).send({
            message: "Login Name is Required"
        });
    }
    if(!data.password) {
        return res.status(400).send({
            message: "Password is Required"
        });
    }
    
    const inboundSetting = new InboundSetting({
        project_id: data.project_id, 
        inbound_format: data.inbound_format, 
        sync_type: data.sync_type,
        ftp_server_link: data.ftp_server_link,
        host: data.host,
        port: data.port,
        login_name: data.login_name,
        password: data.password
            
    });
    InboundSetting.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((InboundSetting) => {
        console.log(req.params.id);
      if (!InboundSetting) {
        return res.status(404).send({
          message: "no Project found"
        });
      }
      res.status(200).send({
          message:"Setting Update Successfully"
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

};
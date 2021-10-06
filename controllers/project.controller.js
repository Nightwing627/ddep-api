const Project = require('../models/project.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    if(!req.body.ProjectCode) {
        return res.status(400).send({
            message: "Project Code Not Found"
        });
    }
    if(!req.body.ProjectName) {
        return res.status(400).send({
            message: "Project Name Not Found"
        });
    }
    if(!req.body.CompanyName) {
        return res.status(400).send({
            message: "Company Name is Required"
        });
    }
    if(!req.body.InboundSetting.inbound_format) {
        return res.status(400).send({
            message: "Inbound Format is Required"
        });
    }
    if(!req.body.InboundSetting.sync_type) {
        return res.status(400).send({
            message: "Select Syncronize Type"
        });
    }
    if(!req.body.InboundSetting.ftp_server_link) {
        return res.status(400).send({
            message: "FTP URL is Required"
        });
    }
    if(!req.body.InboundSetting.host) {
        return res.status(400).send({
            message: "Host Name is Required"
        });
    }
    if(!req.body.InboundSetting.port) {
        return res.status(400).send({
            message: "Port Number is Required"
        });
    }
    if(!req.body.InboundSetting.login_name) {
        return res.status(400).send({
            message: "Login Name is Required"
        });
    }
    if(!req.body.InboundSetting.password) {
        return res.status(400).send({
            message: "Password is Required"
        });
    }
    if(!req.body.OutboundSetting.outbound_format) {
        return res.status(400).send({
            message: "Outbound Format is Required"
        });
    }
    if(!req.body.OutboundSetting.sync_type_out) {
        return res.status(400).send({
            message: "Synchronize Output Type is Required"
        });
    }
    if(!req.body.OutboundSetting.api_url) {
        return res.status(400).send({
            message: "API URL is Required"
        });
    }
    if(!req.body.ScheduleSetting.Schedule_configure) {
        return res.status(400).send({
            message: "Schedule Configure is Required"
        });
    }
    if(!req.body.ScheduleSetting.schedule_type) {
        return res.status(400).send({
            message: "Schedule Type is Required"
        });
    }
    if(!req.body.ScheduleSetting.occurs) {
        return res.status(400).send({
            message: "Please Define occurs is Required"
        });
    }
    if(!req.body.ScheduleSetting.recurs_count) {
        return res.status(400).send({
            message: "Count is Required"
        });
    }
    if(!req.body.ScheduleSetting.recurs_time) {
        return res.status(400).send({
            message: "Time is Required"
        });
    }
    
    const project = new Project({
        ProjectCode: req.body.ProjectCode, 
        ProjectName: req.body.ProjectName,
        CompanyName: req.body.CompanyName,
        InboundSetting:req.body.InboundSetting,
        OutboundSetting:req.body.OutboundSetting,
        ScheduleSetting:req.body.ScheduleSetting, 
    });
    project.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({msg:"Project Saved Successfully"});
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
    project.find()
    .then(users => {
        res.status(200).send({data:users})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = Project.find();
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
    
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};
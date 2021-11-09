bodyParser = require('body-parser');
const Project = require('../models/project.model.js');

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
   
   
    if(!data.ProjectCode) {
        return res.status(400).send({
            message: "Project Code Not Found"
        });
    }
    if(!data.ProjectName) {
        return res.status(400).send({
            message: "Project Name Not Found"
        });
    }
    if(!data.CompanyName) {
        return res.status(400).send({
            message: "Company Name is Required"
        });
    }
    
    const project = new Project({
        ProjectCode: data.ProjectCode, 
        ProjectName: data.ProjectName,
        CompanyName: data.CompanyName,
       
    });
    project.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({id:data._id,msg:"Project Saved Successfully"});
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
    Project.find()
    .then(projects => {
        res.status(200).send({data:projects})
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
    const id = req.params.id;

    Project.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Project with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Project with id=" + id });
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
   
   
    if(!data.ProjectCode) {
        return res.status(400).send({
            message: "Project Code Not Found"
        });
    }
    if(!data.ProjectName) {
        return res.status(400).send({
            message: "Project Name Not Found"
        });
    }
    if(!data.CompanyName) {
        return res.status(400).send({
            message: "Company Name is Required"
        });
    }
    
    const project = new Project({
        ProjectCode: data.ProjectCode, 
        ProjectName: data.ProjectName,
        CompanyName: data.CompanyName,
    });
    Project.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((project) => {
        console.log(req.params.id);
      if (!project) {
        return res.status(404).send({
          message: "no Project found"
        });
      }
      res.status(200).send({
          message:"Project Update Successfully"
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
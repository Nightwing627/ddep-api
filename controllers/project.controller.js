bodyParser = require("body-parser");
const Project = require("../models/project.model.js");
const InboundSetting = require("../models/inbound_setting.model.js");
const OutboundSetting = require("../models/outbound_setting.model.js");
const ScheduleSetting = require("../models/schedule_setting.model.js");
const fsp = require("fsp");

// Create and Save a new Note
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
exports.fullProject = (req, res) => {
  var resources = {
    projectCode: "$ProjectCode",
  };
  Project.aggregate(
    [
      {
        $lookup: {
          from: "inboundsettings", // collection to join
          localField: "_id", //field from the input documents
          foreignField: "item_id", //field from the documents of the "from" collection
          as: "inbound_setting", // output array field
        },
      },

      {
        $lookup: {
          from: "outboundsettings", // from collection name
          localField: "_id",
          foreignField: "item_id",
          as: "outbound_setting",
        },
      },
      {
        $lookup: {
          from: "schedulesettings", // from collection name
          localField: "_id",
          foreignField: "item_id",
          as: "schedule_setting",
        },
      },
      {
        $lookup: {
          from: "inboundhistories",
          localField: "_id",
          foreignField: "item_id",
          as: "inbound_history",
        },
      },
      {
        $addFields: {
          inbound_history: { $slice: ["$inbound_history", -1] },
        },
      },
      {
        $lookup: {
          from: "outboundhistories",
          localField: "_id",
          foreignField: "item_id",
          as: "outbound_history",
        },
      },
      {
        $addFields: {
          outbound_history: { $slice: ["$outbound_history", -1] },
        },
      },
      {
        $unwind: {
          path: "$inbound_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$outbound_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$schedule_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    function (error, data) {
      data = data.map((project) => {
        project = {
          ...project,
          ProjectCode: project.ItemCode,
          ProjectName: project.ItemName,
        };
        return project;
      });
      res.status(200).send({ data: data });
      //handle error case also
    }
  );
};

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

  if (!data.ProjectCode) {
    return res.status(400).send({
      message: "Project Code Not Found",
    });
  }
  if (!data.ProjectName) {
    return res.status(400).send({
      message: "Project Name Not Found",
    });
  }
  if (!data.CompanyName) {
    return res.status(400).send({
      message: "Company Name is Required",
    });
  }

  const project = new Project({
    ItemCode: data.ProjectCode,
    ItemName: data.ProjectName,
    CompanyName: data.CompanyName,
    isActive: "1",
  });
  project
    .save()
    .then((data) => {
      //res.send(data);
      res.status(200).send({ id: data._id, msg: "Project Saved Successfully" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  //var page =req.query.page;
  //var limit =eval(req.query.limit);
  //console.log(limit*page);
  Project.find()
    .then((projects) => {
      res.status(200).send({ data: projects });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.checkecodexsit = (req, res) => {
  //var page =req.query.page;
  //var limit =eval(req.query.limit);
  //console.log(limit*page);
  var project_id = req.body.project_id;
  Project.find({ ItemCode: req.body.ProjectCode })
    .then((projects) => {
      if (projects.length > 0 && projects[0]._id != project_id) {
        //res.send(projects._id);
        //console.log(projects[0]._id);
        res.send("false");
        //res.status(200).send({status:true,msg:"Project Code Exsits"})
      } else {
        res.send("true");
        //res.status(200).send({status:false,msg:"Project Code available"});
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.countAll = (req, res) => {
  var query = Project.find();
  query.count(function (err, count) {
    res.status(200).send({ total: count });
  });
};
exports.searchUser = (req, res) => {};
// Find a single note with a noteId
exports.findOne = (req, res) => {
  const id = req.params.id;

  Project.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).json({ message: "Not found Project with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error retrieving Project with id=" + id });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
  var data = req.body;
  console.log("update", data)
  //var check =isJson(data);
  // if(!check)
  // {
  //     //data = JSON.parse(req.body);
  // }
  //var data = JSON.parse(req.body);

  //data = JSON.stringify(req.body);
  //data = JSON.parse(data);

  if (!data.ProjectName && data.isActive == undefined) {
    return res.status(400).send({
      message: "Project Name Not Found",
    });
  }
  if (!data.CompanyName && data.isActive == undefined) {
    return res.status(400).send({
      message: "Company Name is Required",
    });
  }

  const project = {
    ItemCode: data.ProjectCode,
    ItemName: data.ProjectName,
    CompanyName: data.CompanyName,
    isActive: data.isActive
  };
  Project.findByIdAndUpdate(req.params.id, project, { new: true })
    .then((project) => {
      //console.log(req.params.id);
      if (!project) {
        return res.status(404).send({
          status: "0",
          message: "no Project found",
        });
      }
      res.status(200).send({
        status: "1",
        message: "Project Update Successfully",
      });
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the Project",
        err: err,
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  ProjectCode.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.json({ Status: "0", Msg: "", ErrMsg: err, Data: [] });
    } else {
      res.json({
        Status: "1",
        Msg: "Deleted Successfully",
        ErrMsg: "",
        Data: [],
      });
    }
  });
};

exports.fullProject2 = (req, res) => {
  res.json(fsp.DB());
};

exports.scheduled_porject = (req, res) => {
  var resources = {
    projectCode: "$ProjectCode",
  };
  Project.aggregate(
    [
      {
        $lookup: {
          from: "inboundsettings", // collection to join
          localField: "_id", //field from the input documents
          foreignField: "project_id", //field from the documents of the "from" collection
          as: "inbound_setting", // output array field
        },
      },

      {
        $lookup: {
          from: "outboundsettings", // from collection name
          localField: "_id",
          foreignField: "project_id",
          as: "outbound_setting",
        },
      },
      {
        $lookup: {
          from: "schedulesettings", // from collection name
          localField: "_id",
          foreignField: "project_id",
          as: "schedule_setting",
        },
      },
      {
        $lookup: {
          from: "inboundhistories",
          localField: "_id",
          foreignField: "project_id",
          as: "inbound_history",
        },
      },
      {
        $addFields: {
          inbound_history: { $slice: ["$inbound_history", -1] },
        },
      },
      {
        $lookup: {
          from: "outboundhistories",
          localField: "_id",
          foreignField: "project_id",
          as: "outbound_history",
        },
      },
      {
        $addFields: {
          outbound_history: { $slice: ["$outbound_history", -1] },
        },
      },
      {
        $unwind: {
          path: "$inbound_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$outbound_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$schedule_setting",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    function (error, data) {
      res.status(200).send({ data: data });
      //handle error case also
    }
  );
};

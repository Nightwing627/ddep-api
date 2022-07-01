const Project = require('../models/item.model.js');
const InboundSetting = require('../models/inbound_setting.model.js');
const OutboundSetting = require('../models/outbound_setting.model.js');
const ScheduleSetting = require('../models/schedule_setting.model.js');

const fulllistProject = async () => {
    let result;
    await Project.find()
    .then(projects => {
        result = projects
    }).catch(err => {
        result = "error";
    });
    return result;
}

const findOne = async (id) => {
    let result;

    await Project.findById(id)
    .then(data => {
        result = data;
    //   if (!data)
    //     return { message: "Not found Project with id " + id };
    //   else return {data: data};
    })
    .catch(err => {
      result = { message: "Error retrieving Project with id=" + id };
    });

    return result;
}

const create = async (data) => {
    let result;

    const project = new Project({
        ProjectCode: data.projectCode,
        ProjectName: data.projectName,
        CompanyName: data.projectDescr, //this is old value
        isActive: data.isActive,
        group: data.group
      });
      await project
        .save()
        .then((data) => {
          result = { pj_ID: data._id, projectCode: data.ProjectCode, projectName: data.ProjectName, projectDescr: data.CompanyName, group: data.group,
            isActive: data.isActive, createdAt: data.createdAt, updatedAt: data.updatedAt, msg: "Project Saved Successfully" };
        })
        .catch((err) => {
          result = {
            message: err.message || "Some error occurred while creating the User.",
          };
        });
    
    return result;
}

const update = async (id, data) => {
    const project = {
        ProjectCode: data.projectCode,
        ProjectName: data.projectName,
        CompanyName: data.projectDescr, //this is old value
        isActive: data.isActive,
        group: data.group
      };
      let result;
      await Project.findByIdAndUpdate(id, project, { new: true })
        .then((item) => {
          //console.log(req.params.id);
          if (!item) {
            result = {
              status: "0",
              message: "no Project found",
            };
          }
          result = {
            status: "1",
            message: "Project Update Successfully",
          };
        })
        .catch((err) => {
          result = {
            message: "error while updating the Project",
            err: err,
          };
        });
      return result;
}

module.exports = { findOne, fulllistProject, create, update };
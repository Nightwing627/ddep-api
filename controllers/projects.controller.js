const Project = require('../models/item.model.js');
const InboundSetting = require('../models/inbound_setting.model.js');
const OutboundSetting = require('../models/outbound_setting.model.js');
const ScheduleSetting = require('../models/schedule_setting.model.js');

const fulllistProject = async () => {
    let result;
    await Item.find()
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

module.exports = { findOne, fulllistProject };
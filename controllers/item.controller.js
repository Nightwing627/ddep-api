const Project = require('../models/project.model.js');
const InboundSetting = require('../models/inbound_setting.model.js');
const OutboundSetting = require('../models/outbound_setting.model.js');
const ScheduleSetting = require('../models/schedule_setting.model.js');

const fulllistItem = async () => {
    let items;
    await Project.aggregate([
        {
        $lookup: {
            from: "inboundsettings", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "item_id",//field from the documents of the "from" collection
            as: "inbound_setting"// output array field
        },
        
    },
    
    {
        $lookup: {
            from: "outboundsettings", // from collection name
            localField: "_id",
            foreignField: "item_id",
            as: "outbound_setting"
        }
    },
    {
        $lookup: {
            from: "schedulesettings", // from collection name
            localField: "_id",
            foreignField: "item_id",
            as: "schedule_setting"
        }
    },
    { "$lookup": {
        "from": "inboundhistories",
        "localField": "_id",
        "foreignField": "item_id",
        "as": "inbound_history"
      }},
      { "$addFields": {
        "inbound_history": { "$slice": ["$inbound_history", -1] }
      }},
    { "$lookup": {
        "from": "outboundhistories",
        "localField": "_id",
        "foreignField": "item_id",
        "as": "outbound_history"
      }},
      { "$addFields": {
        "outbound_history": { "$slice": ["$outbound_history", -1] }
      }},
    {
        $unwind:{
            path: "$inbound_setting",
            preserveNullAndEmptyArrays: true
          },
    },
    {
        $unwind:{
            path: "$outbound_setting",
            preserveNullAndEmptyArrays: true
          },
    },
    {
        $unwind:{
            path: "$schedule_setting",
            preserveNullAndEmptyArrays: true
          },
    }
    ],function (error, data) {
        items = data;
        //handle error case also
      }
    );
    return items;
  };

  module.exports = { fulllistItem };
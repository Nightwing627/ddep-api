const Item = require("../models/project.model.js");
const InboundSetting = require("../models/inbound_setting.model.js");
const OutboundSetting = require("../models/outbound_setting.model.js");
const ScheduleSetting = require("../models/schedule_setting.model.js");

const fulllistItem = async () => {
  let items;
  await Item.aggregate(
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
      items = data;
      //handle error case also
    }
  );
  return items;
};

const create = async (data) => {
  let result;
  const item = new Item({
    ProjectId: data.ProjectId,
    ItemCode: data.ItemCode,
    ItemName: data.ItemName,
    CompanyName: data.CompanyName,
    isActive: data.isActive,
  });
  await item
    .save()
    .then((data) => {
      result = { item_id: data._id, msg: "Item Saved Successfully" };
    })
    .catch((err) => {
      result = {
        message: err.message || "Some error occurred while creating the User.",
      };
    });

  return result;
};

const update = async (id, data) => {
  const item = {
    ItemCode: data.ItemCode,
    ItemName: data.ItemName,
    CompanyName: data.CompanyName,
    isActive: data.isActive,
  };
  let result;
  await Item.findByIdAndUpdate(id, item, { new: true })
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
};

module.exports = { fulllistItem, create, update };

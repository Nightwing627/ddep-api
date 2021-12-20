bodyParser = require('body-parser');
const ScheduleSetting = require('../models/schedule_setting.model.js');

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
   
   var checkschedule =isJson(data);
   
   if(checkschedule)
   {

        data = JSON.parse(data);
        data.Schedule_configure_inbound="JSON",
        data.schedule_type_inbound="API",
        data.occurs_inbound="1",
        data.recurs_count_inbound="1",
        data.recurs_time_inbound="12:00"
        data.Schedule_configure_outbound="JSON",
        data.schedule_type_outbound="API",
        data.occurs_outbound="1",
        data.recurs_count_outbound="1",
        data.recurs_time_outbound="12:00"
   }
   
    
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    if(!data.Schedule_configure_inbound) {
        return res.status(400).send({
            message: "Schedule Configure is Required"
        });
    }
    if(!data.schedule_type_inbound) {
        return res.status(400).send({
            message: "Schedule Type is Required"
        });
    }
    if(!data.occurs_inbound) {
        return res.status(400).send({
            message: "Please Define occurs is Required"
        });
    }
    if(!data.recurs_count_inbound) {
        return res.status(400).send({
            message: "Count is Required"
        });
    }
    if(!data.recurs_time_inbound) {
        return res.status(400).send({
            message: "Time is Required"
        });
    }
    if(!data.Schedule_configure_outbound) {
        return res.status(400).send({
            message: "Schedule Configure is Required"
        });
    }
    if(!data.schedule_type_outbound) {
        return res.status(400).send({
            message: "Schedule Type for Outbound is Required"
        });
    }
    if(!data.occurs_outbound) {
        return res.status(400).send({
            message: "Please Define occurs is Required"
        });
    }
    if(!data.recurs_count_outbound) {
        return res.status(400).send({
            message: "Count is Required"
        });
    }
    if(!data.recurs_time_outbound) {
        return res.status(400).send({
            message: "Time is Required"
        });
    }
    const scheduleSetting = new ScheduleSetting({
        project_id: data.project_id, 
        Schedule_configure_inbound: data.Schedule_configure_inbound, 
        schedule_type_inbound: data.schedule_type_inbound,
        occurs_inbound: data.occurs_inbound,
        recurs_count_inbound: data.recurs_count_inbound,
        recurs_time_inbound: data.recurs_time_inbound,
        occurs_weekly_fields_inbound:data.occurs_weekly_fields_inbound,
        monthly_field_setting_inbound:data.monthly_field_setting_inbound,
        //next_date_inbound:data.next_date_inbound,
        Schedule_configure_outbound: data.Schedule_configure_outbound,
        schedule_type_outbound: data.schedule_type_outbound,
        occurs_outbound: data.occurs_outbound,
        recurs_count_outbound: data.recurs_count_outbound,
        recurs_time_outbound: data.recurs_time_outbound,
        occurs_weekly_fields_outbound:data.occurs_weekly_fields_outbound,
        monthly_field_setting_outbound:data.monthly_field_setting_outbound,
        //next_date_outbound:data.next_date_outbound,
        
    });
    scheduleSetting.save()
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
   ScheduleSetting.find()
    .then(ScheduleSetting => {
        res.status(200).send({data:ScheduleSetting})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = ScheduleSetting.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;

    ScheduleSetting.findOne({"project_id":id})
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
   
   var checkschedule =isJson(data.ScheduleSetting);
   
   if(checkschedule)
   {

       data = JSON.parse(data);
        data.Schedule_configure_inbound="JSON",
        data.schedule_type_inbound="API",
        data.occurs_inbound="1",
        data.recurs_count_inbound="1",
        data.recurs_time_inbound="12:00"
        data.Schedule_configure_outbound="JSON",
        data.schedule_type_outbound="API",
        data.occurs_outbound="1",
        data.recurs_count_outbound="1",
        data.recurs_time_outbound="12:00"
   }
   
    
   if(!data.project_id) {
    return res.status(400).send({
        message: "Project Not found"
    });
    }
   /* if(!data.Schedule_configure_inbound) {
    return res.status(400).send({
        message: "Schedule Configure is Required"
    });
    }
    if(!data.schedule_type_inbound) {
        return res.status(400).send({
            message: "Schedule Type is Required"
        });
    }
    if(!data.occurs_inbound) {
        return res.status(400).send({
            message: "Please Define occurs is Required"
        });
    }
    if(!data.recurs_count_inbound) {
        return res.status(400).send({
            message: "Count is Required"
        });
    }
    if(!data.recurs_time_inbound) {
        return res.status(400).send({
            message: "Time is Required"
        });
    }
    if(!data.Schedule_configure_outbound) {
        return res.status(400).send({
            message: "Schedule Configure is Required"
        });
    }
    if(!data.schedule_type_outbound) {
        return res.status(400).send({
            message: "Schedule Type is Required"
        });
    }
    if(!data.occurs_outbound) {
        return res.status(400).send({
            message: "Please Define occurs is Required"
        });
    }
    if(!data.recurs_count_outbound) {
        return res.status(400).send({
            message: "Count is Required"
        });
    }
    if(!data.recurs_time_outbound) {
        return res.status(400).send({
            message: "Time is Required"
        });
    } */
    const scheduleSetting = new ScheduleSetting({
        Schedule_configure_inbound: data.Schedule_configure_inbound, 
        schedule_type_inbound: data.schedule_type_inbound || "",
        occurs_inbound: data.occurs_inbound || "",
        recurs_count_inbound: data.recurs_count_inbound || "",
        recurs_time_inbound: data.recurs_time_inbound || "",
        Schedule_configure_outbound: data.Schedule_configure_outbound || "",
        schedule_type_outbound: data.schedule_type_outbound || "",
        occurs_outbound: data.occurs_outbound || "",
        recurs_count_outbound: data.recurs_count_outbound || "",
        recurs_time_outbound: data.recurs_time_outbound || "",
        
    });
    ScheduleSetting.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((ScheduleSetting) => {
        //console.log(req.params.id);
      if (!ScheduleSetting) {
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
    ScheduleSetting.findByIdAndRemove(req.params.id,function(err){
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
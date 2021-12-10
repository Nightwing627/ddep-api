const mongoose = require('mongoose');

const ScheduleSettingSchema = mongoose.Schema({
    
   
        project_id:{
            type:mongoose.Schema.Types.ObjectId,ref:'Project'
        },
        Schedule_configure_inbound:String ,
        schedule_type_inbound: String,
        occurs_inbound: String,
        occurs_weekly_fields_inbound:{ type : Array , "default" : [] },
        monthly_field_setting_inbound:{type:Array,"default":[]},
        recurs_count_inbound: String,
        recurs_time_inbound:String ,
        Schedule_configure_outbound:String ,
        schedule_type_outbound: String,
        occurs_outbound: String,
        recurs_count_outbound: String,
        recurs_time_outbound:String ,
        next_date_inbound :{type:Date,"default":Date.now}
     
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('ScheduleSetting', ScheduleSettingSchema);
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
        occurs_weekly_fields_outbound:{ type : Array , "default" : [] },
        monthly_field_setting_outbound:{type:Array,"default":[]},
        next_date_inbound :{type:Date,"default":Date.now},
        next_date_outbound :{type:Date,"default":Date.now},
        duration_inbound_start_date:String,
        duration_inbound_is_end_date:String,
        duration_inbound_end_date:String,
        duration_outbound_start_date:String,
        duration_outbound_is_end_date:String,
        duration_outbound_end_date:String
     
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('ScheduleSetting', ScheduleSettingSchema);
const mongoose = require('mongoose');

const ScheduleSettingSchema = mongoose.Schema({
    
   
        project_id:String,
        Schedule_configure_inbound:String ,
        schedule_type_inbound: String,
        occurs_inbound: String,
        recurs_count_inbound: String,
        recurs_time_inbound:String ,
        Schedule_configure_outbound:String ,
        schedule_type_outbound: String,
        occurs_outbound: String,
        recurs_count_outbound: String,
        recurs_time_outbound:String ,
     
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('ScheduleSetting', ScheduleSettingSchema);
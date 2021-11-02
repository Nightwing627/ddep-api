const mongoose = require('mongoose');

const OutboundSettingSchema = mongoose.Schema({
   
    
        project_id:String ,
        outbound_format:String,
        sync_type_out:String,
        api_url:String,
     
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('OutboundSetting', OutboundSettingSchema);
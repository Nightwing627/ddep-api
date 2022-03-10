const mongoose = require('mongoose');

const OutboundHistorySchema = mongoose.Schema({
   
    
        project_id:{
            type:mongoose.Schema.Types.ObjectId,ref:'Project'
        } ,
       
        status:String,
        
     
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('OutboundHistory', OutboundHistorySchema);
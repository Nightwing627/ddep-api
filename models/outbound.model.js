const mongoose = require('mongoose');

const OutboundSchema = mongoose.Schema({
    project_code: String,
    project_id: String,
    outbound_data:{ Array }
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('Outbound', OutboundSchema);
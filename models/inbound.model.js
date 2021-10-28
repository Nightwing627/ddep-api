const mongoose = require('mongoose');

const InboundSchema = mongoose.Schema({
    project_code: String,
    project_id: String,
    inbound_data:{ Array }
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('Inbound', InboundSchema);
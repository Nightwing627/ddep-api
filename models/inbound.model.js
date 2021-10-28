const mongoose = require('mongoose');

const InboundSchema = mongoose.Schema({
    project_code: String,
    project_id: String,
    inbound_data:[mongoose.Schema.Types.Mixed]
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


},{strict: false}, {
    timestamps: true
});

module.exports = mongoose.model('Inbound', InboundSchema);
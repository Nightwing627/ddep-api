const mongoose = require('mongoose');

const TemplatesSchema = mongoose.Schema({
    TemplateCode: String,
    TemplateName: String,
    TemplateType: String,
    isActive:String
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('templates', TemplatesSchema);
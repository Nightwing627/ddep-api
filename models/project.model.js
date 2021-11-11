const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    ProjectCode: String,
    ProjectName: String,
    CompanyName: String,
    isActive:String
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
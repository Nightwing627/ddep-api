const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    ProjectCode: String,
    ProjectName: String,
    //projectDescr:String,
    //group:String,

    ProjectDescr: String, //this is old value
    isActive:String
    
},{
    timestamps: true
});

module.exports = mongoose.model('Projects', ProjectSchema);
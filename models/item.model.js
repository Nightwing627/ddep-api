const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    ProjectCode: {type: String, unique: true},
    ProjectName: String,
    //projectDescr:String,
    group:String,

    ProjectDescr: String, //this is old value
    Sequence: String,
    isActive:String
    
},{
    timestamps: true
});

module.exports = mongoose.model('Projects', ProjectSchema);
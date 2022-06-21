const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    ItemCode: String,
    ItemName: String,
    ProjectId: String,
    //ItemDescr:String,
    //group:String,

    CompanyName: String, //this is old value
    isActive:String
    
},{
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);
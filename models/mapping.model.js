const mongoose = require('mongoose');

const mappingSchema = mongoose.Schema({
    item_id:{
            type:mongoose.Schema.Types.ObjectId,ref:'Project'
        } ,
        item_code:String,
        company_code:String,
        inbound_format:String,
        inbound_file_url:String,
        inbound_content:String,
        outbound_format:String,
        outbound_file_url:String,
        outbound_content:String,
        mapping_list:String,
        is_active:String,
        createdBy:String,
        updateBy:String,
    },{
    timestamps: true
});

module.exports = mongoose.model('mapping', mappingSchema);
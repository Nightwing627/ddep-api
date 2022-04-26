const mongoose = require('mongoose');

const mappingoutbounduploadSchema = mongoose.Schema({
        project_id:String,
        compnay_code:String,
        bound_format:String,
        file:String,
        is_active:String,
        createdBy:String,
        updateBy:String,
    },{
    timestamps: true
});

module.exports = mongoose.model('mapping_outbound_upload', mappingoutbounduploadSchema);
const mongoose = require('mongoose');

const mappinginbounduploadSchema = mongoose.Schema({
        project_id:String,
        compnay_code:String,
        bound_format:String,
        file:String,
        createdBy:String,
        updateBy:String,
    },{
    timestamps: true
});

module.exports = mongoose.model('mapping_inbound_upload', mappinginbounduploadSchema);
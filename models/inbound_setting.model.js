const mongoose = require('mongoose');

const InboundSettingSchema = mongoose.Schema({
    project_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'Project'
    },    
    inbound_format: String ,
    sync_type: String,
    ftp_server_link:String,
    host: String,
    port:String,
    login_name:String,
    password:String ,

},{
    timestamps: true
});

module.exports = mongoose.model('InboundSetting', InboundSettingSchema);
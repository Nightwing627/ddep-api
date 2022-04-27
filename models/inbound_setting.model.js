const mongoose = require('mongoose');

const InboundSettingSchema = mongoose.Schema({
    project_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'Project'
    },    
    inbound_format: String,
    sync_type: String,
    ftp_server_link:String,
    host: String,
    ftp_port:String,
    ftp_login_name:String,
    ftp_password:String,
    ftp_folder:String,
    ftp_backup_folder:String,
    api_type:String,
    api_ddep_api: String,
    // api_ddep_api_get_or_post: String,
    api_ddep_api_receive_parameter_name:String,
    api_user_api:String,
    createdBy:String,
    updateBy:String,
    is_active:{
        type: String,
        default:'Inactive'
    }

},{
    timestamps: true
});

module.exports = mongoose.model('InboundSetting', InboundSettingSchema);
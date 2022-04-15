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
    folder:String,
    is_password_encrypted:String,
    backup_folder:String,
    api_type:String,
    api_ddep_api:String,
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
const mongoose = require('mongoose');

const InboundSettingSchema = mongoose.Schema({
    item_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'Item'
    },
    itemCode:String,
    itemName:String,
    itemDescr:String,    
    inbound_format: String, // this is Old Value
    //inboundFormat:String,
    verison:String,
    sync_type: String, //this is old value
    //inboundType:String , //he type of Inbound (DDEP API | User API | SFTP/FTP)
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
    // isActive:{
    //     type: String,
    //     default:'Inactive'
    //}

},{
    timestamps: true
});

module.exports = mongoose.model('InboundSetting', InboundSettingSchema);
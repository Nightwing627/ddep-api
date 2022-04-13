const mongoose = require('mongoose');

const appErrorConfigSchema = new mongoose.Schema({
	Config_Cleanup_days : {type: Number, require: true},
	Config_Last_date : {type: Date},
})

const tbl_app_error_config = mongoose.model('tbl_app_error_config', appErrorConfigSchema);

const appErrorSchema = new mongoose.Schema({
	Error_ID : {type: Number},
	Error_Datetime : {type: Date},
	Error_Page : {type: String},
	Error_Module : {type: String},
	Error_Info : {type: String},
	Error_URL : {type: String},
	Error_HTTP_statue_code : {type: String},
	Error_Username : {type: String},
	Error_Companycode : {type: String},
}, {
	timestamps: true
})

const tbl_app_error = mongoose.model('tbl_app_error', appErrorSchema);

module.exports = { tbl_app_error, tbl_app_error_config }
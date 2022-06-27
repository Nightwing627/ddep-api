const mongoose = require('mongoose');
const mappingSchema = mongoose.Schema({
	item_id:{
		type:mongoose.Schema.Types.ObjectId, ref:'Items'
	},
	inbound_format:String,
	outbound_format:String,
	mapping_data:String,
	createdBy:String,
	updateBy:String,
},{
	timestamps: true
});
module.exports = mongoose.model('mapping', mappingSchema);
const mongoose = require('mongoose');
const OutboundValidationSchema = mongoose.Schema({
	item_id:{
		type:mongoose.Schema.Types.ObjectId, ref:'Item'
	},
	validations:[mongoose.Schema.Types.Mixed],
}, {
	timestamps: true
});

module.exports = mongoose.model('outbound_validation', OutboundValidationSchema);
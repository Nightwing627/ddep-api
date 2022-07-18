const mongoose = require('mongoose');
const formulaSchema = mongoose.Schema({
	item_id:{
		type:mongoose.Schema.Types.ObjectId, ref:'Items'
	},
	item_unique_name:String,
	value:String,
	defaultValue:String,
	isRequired:String,
	valueMustbe:String,
	enableTrim:String,
	enableRounding:String,
	enableDecimal:String,
	decimal:String,
	createdBy:String,
	updateBy:String,
},{
	timestamps: true
});
module.exports = mongoose.model('items_formula', formulaSchema);
const mongoose = require('mongoose');

const InboundHistorySchema = mongoose.Schema({
        item_id:{
            type:mongoose.Schema.Types.ObjectId,ref:'Item'
        } ,
        status:String,
    },{
    timestamps: true
});

module.exports = mongoose.model('InboundHistory', InboundHistorySchema);
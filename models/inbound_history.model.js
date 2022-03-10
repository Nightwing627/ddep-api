const mongoose = require('mongoose');

const InboundHistorySchema = mongoose.Schema({
        project_id:{
            type:mongoose.Schema.Types.ObjectId,ref:'Project'
        } ,
        status:String,
    },{
    timestamps: true
});

module.exports = mongoose.model('InboundHistory', InboundHistorySchema);
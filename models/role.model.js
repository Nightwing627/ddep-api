const mongoose = require('mongoose');

const tbl_roleSchema = mongoose.Schema({
    role_id:String,
    role_name:String,
    department_code:String,
    create_by:String,
    create_date:String,
    update_by:String,
    update_date:String,
    remark:String,
}, {
    timestamps: true
});

module.exports = mongoose.model('tbl_role', tbl_roleSchema);
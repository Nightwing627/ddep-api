const mongoose = require('mongoose');

const tbl_staff_branchSchema = mongoose.Schema({
  id:String,
  user_name:String,
  branch_code:String,
  create_by:String,
  create_date:String  
}, {
    timestamps: true
});

module.exports = mongoose.model('tbl_staff_branch', tbl_staff_branchSchema);
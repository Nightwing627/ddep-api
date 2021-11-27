const mongoose = require('mongoose');

const tbl_staff_departmentSchema = mongoose.Schema({
  id:String,
  user_name:String,
  department_code:String,
  create_by:String,
  create_date:String  
}, {
    timestamps: true
});

module.exports = mongoose.model('tbl_staff_department', tbl_staff_departmentSchema);
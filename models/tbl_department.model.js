const mongoose = require('mongoose');

const tbl_departmentSchema = mongoose.Schema({
  department_code:String,
  department_name:String,
  create_by:String,
  create_date:String,
  update_by:String,
  update_date:String ,
  remark:String
}, {
    timestamps: true
});

module.exports = mongoose.model('tbl_department', tbl_departmentSchema);
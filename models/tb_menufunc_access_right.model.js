const mongoose = require('mongoose');

const tb_menufuncSchema = mongoose.Schema({
  RowId:String,
  roleid:String,
  rolename:String,
  func_id:String,
  CanRead:String,
  CanAdd:String,
  CanEdit:String,
  CanDelete:String,
  created_date:String,
  created_by:String,
  modified_date:String,
  modified_by:String,
  is_active:String

}, {
    timestamps: true
});

module.exports = mongoose.model('tb_menufunc_access_right', tb_menufuncSchema);
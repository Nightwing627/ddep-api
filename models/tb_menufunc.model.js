const mongoose = require('mongoose');

const tb_menufuncSchema = mongoose.Schema({
  pkey:String,
  func_id:String,
  func_name:String,
  link:String,
  parent_id:String,
  sort_id:String,
  disable:String
}, {
    timestamps: true
});

module.exports = mongoose.model('tb_menufunc', tb_menufuncSchema);
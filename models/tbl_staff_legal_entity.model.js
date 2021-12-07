const mongoose = require('mongoose');

const tbl_staff_legal_entity = mongoose.Schema({
    id: String,
    user_name: String,
    legal_entity_code: String,
    create_by: String,
    create_date: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('tbl_staff_legal_entity', tbl_staff_legal_entity);
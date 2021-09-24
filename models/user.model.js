const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    enable_fg: String,
    two_auth_fg: String,
    user_name:String,
    display_name:String,
    email:String,
    staff_other_code:String,
    first_name:String,
    last_name:String,
    Local_lang_name:String,
    Department_code:String,
    skype_address:String,
    title:String,
    tel_country_idd:String,
    tel_city_idd:String,
    tel:String,
    fax_country_idd:String,
    fax_city_idd:String,
    fax:String,
    country:String,
    state:String,
    city:String,
    postal_code:String,
    address1:String,
    address2:String,
    address3:String,
    mobile_country_idd:String,
    mobile_city_idd:String,
    mobile:String

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
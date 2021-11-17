const User = require('../models/user.model.js');
const ase = require('../my_modules/aes');

// Create and Save a new Note
exports.create = (req, res) => {
    var Aes = new ase();
    var jsondata = req.body;
    var post_data_s = Aes.Decrypt(jsondata);
    var post_data = JSON.parse(post_data_s);
    const user = new User({
        enable_fg: post_data.enable_fg || null, 
        two_auth_fg: post_data.two_auth_fg || null,
        user_name: post_data.user_name || null,
        display_name: post_data.display_name|| null,
        email: post_data.email || null,
        staff_other_code: post_data.staff_other_code || null,
        Department_code: post_data.Department_code|| null,
        first_name: post_data.first_name || null,
        last_name: post_data.last_name || null,
        Local_lang_name: post_data.Local_lang_name || null,
        skype_address: post_data.skype_address || null,
        title: post_data.title || null,
        tel_city_idd: post_data.tel_city_idd || null,
        tel: post_data.tel || null,
        fax_country_idd: post_data.fax_country_idd || null,
        fax_city_idd: post_data.fax_city_idd || null,
        fax: post_data.fax || null,
        country: post_data.country || null,
        state: post_data.state || null,
        city: post_data.city || null,
        postal_code: post_data.postal_code ||null,
        address1: post_data.address1 || null,
        address2: post_data.address2 || null,
        address3: post_data.address3 || null,
        mobile_country_idd: post_data.mobile_country_idd || null,
        mobile_city_idd: post_data.mobile_city_idd || null,
        mobile: post_data.mobile || null,
        
    });
    user.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({msg:"User Sync Successfully"});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    //var page =req.query.page;
    //var limit =eval(req.query.limit);
   //console.log(limit*page);
    User.find()
    .then(users => {
        res.status(200).send({data:users})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = User.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    if(!req.body.enable_fg) {
        return res.status(400).send({
            message: "Enable Flag Not Found"
        });
    }
    if(!req.body.two_auth_fg) {
        return res.status(400).send({
            message: "Two Auth Flag Not Found"
        });
    }
    if(!req.body.user_name) {
        return res.status(400).send({
            message: "User Name is Required"
        });
    }
    if(!req.body.display_name) {
        return res.status(400).send({
            message: "Display Name is Required"
        });
    }
    if(!req.body.email) {
        return res.status(400).send({
            message: "Email Is Required"
        });
    }
    if(!req.body.staff_other_code) {
        return res.status(400).send({
            message: "Staff Barcode is Required"
        });
    }
    if(!req.body.Department_code) {
        return res.status(400).send({
            message: "Department code is Required"
        });
    }
    if(!req.body.first_name) {
        return res.status(400).send({
            message: "First Name is Required"
        });
    }
    if(!req.body.last_name) {
        return res.status(400).send({
            message: "Last Name is Required"
        });
    }
    if(!req.body.Local_lang_name) {
        return res.status(400).send({
            message: "Local Language is Required"
        });
    }
    if(!req.body.country) {
        return res.status(400).send({
            message: "Country is Required"
        });
    }
    if(!req.body.state) {
        return res.status(400).send({
            message: "State is Required"
        });
    }
    if(!req.body.city) {
        return res.status(400).send({
            message: "City is Required"
        });
    }
    if(!req.body.postal_code) {
        return res.status(400).send({
            message: "Postal Code is Required"
        });
    }
    if(!req.body.address1) {
        return res.status(400).send({
            message: "Address is Required"
        });
    }
    const user = new User({
        enable_fg: req.body.enable_fg, 
        two_auth_fg: req.body.two_auth_fg,
        user_name: req.body.user_name,
        display_name: req.body.display_name,
        email: req.body.email,
        staff_other_code: req.body.staff_other_code,
        Department_code: req.body.Department_code,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        Local_lang_name: req.body.Local_lang_name,
        skype_address: req.body.skype_address || "",
        title: req.body.title || "",
        tel_city_idd: req.body.tel_city_idd || "",
        tel: req.body.tel || "",
        fax_country_idd: req.body.fax_country_idd || "",
        fax_city_idd: req.body.fax_city_idd || "",
        fax: req.body.fax || "",
        country: req.body.country || "",
        state: req.body.state || "",
        city: req.body.city || "",
        postal_code: req.body.postal_code || "",
        address1: req.body.address1 || "",
        address2: req.body.address2 || "",
        address3: req.body.address3 || "",
        mobile_country_idd: req.body.mobile_country_idd || "",
        mobile_city_idd: req.body.mobile_city_idd || "",
        mobile: req.body.mobile || "",
        
    });
    User.findByIdAndUpdate(req.params.id,req.body, { new: true })
    .then((user) => {
        console.log(req.params.id);
      if (!user) {
        return res.status(404).send({
          message: "no user found"
        });
      }
      res.status(200).send({
          message:"User Update Successfully"
      });
    })
    .catch((err) => {
      return res.status(404).send({
        message: "error while updating the post",
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};
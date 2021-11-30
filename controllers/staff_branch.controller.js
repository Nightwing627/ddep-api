const staff_branch = require('../models/tbl_staff_branch.model.js');
const ase = require('../my_modules/aes');

// Create and Save a new Note
exports.create = (req, res) => {
    var Aes = new ase();
    var post_data = req.body;
    //console.log(jsondata.data);
    //var post_data_s = Aes.Decrypt(unescape(jsondata.data));
    //console.log(post_data_s);
    //var post_data = JSON.parse(post_data_s);
    //res.json(post_data);
    //post_data = JSON.parse(jsondata);
    //var syncjson = eval("("+post_data_s+")");
    //console.log(syncjson[0].tbl_staff);
    const userdetails = {};
    Object.entries(post_data).forEach(([key,value])=>{
        userdetails[key] = value; 
    });
    const user = new staff_branch(userdetails);
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
   staff_branch.find()
    .then(users => {
        res.status(200).send({data:users})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = staff_branch.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{

}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    staff_branch.
    find().
    where('id').equals(req.body.id).
    //where('age').gt(17).lt(50).  //Additional where query
    //limit(5).
    //sort({ age: -1 }).
    select('_id').
    exec(function(err,data){
        //console.log(data);
        if(data.length==0){
            res.status(200).send({"status":false,"msg":"not found"});
        }
        else
        {

            res.status(200).json({'status':true,'data':data[0]._id});
        }
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    var post_data = req.body;
    const userdetails = {};
    Object.entries(post_data).forEach(([key,value])=>{
        userdetails[key] = value; 
    });
    const user = new staff_branch(userdetails);
    staff_branch.findByIdAndUpdate(req.params.id,userdetails, { new: true })
    .then((user) => {
        //console.log(req.params.id);
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
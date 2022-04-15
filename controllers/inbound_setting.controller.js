bodyParser = require('body-parser');
const InboundSetting = require('../models/inbound_setting.model.js');

// Create and Save a new Note
function isJson(str) {
    try {
        JSON.parse(str);

    } catch (e) {
        return false;
    }
    return true;
}
exports.create = (req, res) => {
    var data = req.body;
    //var check =isJson(data);
    // if(!check)
    // {
    //     //data = JSON.parse(req.body);
    // }
    //var data = JSON.parse(req.body);

   //data = JSON.stringify(req.body);
   //data = JSON.parse(data);
   var checkinbound =isJson(data);
   
   if(checkinbound)
   {

       data.InboundSetting = JSON.parse(data);
   }
   
    var api_type = data.api_type.split(',');
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    if(!data.inbound_format) {
        return res.status(400).send({
            message: "Inbound Format is Required"
        });
    }
    if(!data.sync_type) {
        return res.status(400).send({
            message: "Select Syncronize Type"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.ftp_server_link) {
        return res.status(400).send({
            message: "FTP URL is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.port) {
        return res.status(400).send({
            message: "Port Number is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.login_name) {
        return res.status(400).send({
            message: "Login Name is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.password) {
        return res.status(400).send({
            message: "Password is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.folder) {
        return res.status(400).send({
            message: "folder path is Required"
        });
    }
    if((data.sync_type=="API" && api_type[0]==undefined || api_type[0]=="")) {
        return res.status(400).send({
            message: "API Type is Required"
        });
    }
    
    if(((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='DDEP_API')|| (data.sync_type=="API" && api_type[1]!=undefined && api_type[1]=='DDEP_API')) && data.api_ddep_api=="")
    {
        return res.status(400).send({
            message: "DDEP API URL is Required"
        });
    } 
    if(((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='DDEP_API')|| (data.sync_type=="API" && api_type[1]!=undefined && api_type[1]=='DDEP_API')) && data.api_ddep_api!="")
    {
        var re = new RegExp(/^(\/)[a-zA-Z0-9-_\/]+$/);
        if (!re.test(data.api_ddep_api)) {
            return res.status(400).send({
                message: "DDEP API is not valid (must start with a '/' and must contain any letter, capitalize letter, number, dash or underscore)"
            });
        }
    }
    if((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='User_API') && data.api_user_api=="")
    {
        return res.status(400).send({
            message: "User API URL is Required"
        });
    }

    const inboundSetting = new InboundSetting({
        project_id:data.project_id,
        inbound_format: data.inbound_format, 
        sync_type: data.sync_type || "",
        ftp_server_link: data.ftp_server_link || "",
        host: data.host || "",
        port: data.port || "",
        login_name: data.login_name || "",
        password: data.password || "",
        folder:data.folder || "",
        is_password_encrypted:data.is_password_encrypted || "",
        api_type:data.api_type || "",
        api_user_api:data.api_user_api || "",
        api_ddep_api:data.api_ddep_api || "",
        createdBy:"",
        updateBy : ""
    });
    inboundSetting.save()
    .then(data => {
        //res.send(data);
        res.status(200).send({
            code: "0",
            MsgCode: "10001",
            MsgType: "Save-Data-Success",
            MsgLang: "en",
            ShortMsg: "Save Successful",
            LongMsg: "The Setting detail information was save successful",
            InternalMsg: "",
            EnableAlert: "No",
            DisplayMsgBy: "ShortMsg",
            msg: "Setting save successfully",
            id: data._id,
            Data: []
        });
    }).catch(err => {
            res.status(500).send({
            code: "1",
            MsgCode: "50001",
            MsgType: "Exception-Error",
            MsgLang: "en",
            ShortMsg: "Update Fail",
            LongMsg: err.message || "Some error occurred while creating the project.",
            InternalMsg: "",
            EnableAlert: "No",
            DisplayMsgBy: "LongMsg",
            message: err.message || "Some error occurred while creating the project.",
            Data: []
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    //var page =req.query.page;
    //var limit =eval(req.query.limit);
   //console.log(limit*page);
   InboundSetting.find()
    .then(InboundSetting => {
        res.status(200).send({data:InboundSetting})
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};
exports.countAll=(req,res)=>{
    var query = InboundSetting.find();
    query.count(function (err, count) {
       res.status(200).send({total:count});
    });
}
exports.searchUser = (req,res)=>{
}
// Find a single note with a noteId
exports.findOne = (req, res) => {
    const id = req.params.id;

    InboundSetting.findOne({"project_id":id})
    .then(data => {
      if (!data)
        res.status(404).json({ message: "Not found Project with id " + id });
      else res.json(data);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error retrieving Project with id=" + id });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    var data = req.body;
    //var check =isJson(data);
    // if(!check)
    // {
    //     //data = JSON.parse(req.body);
    // }
    //var data = JSON.parse(req.body);

    //data = JSON.stringify(req.body);
    //data = JSON.parse(data);
    var checkinbound =isJson(data);
    if(checkinbound)
    {

       data = JSON.parse(data);
    }
   
    var api_type = data.api_type.split(',');
    if(!data.project_id) {
        return res.status(400).send({
            message: "Project Not Found"
        });
    }
    if(!data.inbound_format) {
        return res.status(400).send({
            message: "Inbound Format is Required"
        });
    }
    if(!data.sync_type) {
        return res.status(400).send({
            message: "Select Syncronize Type"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.ftp_server_link) {
        return res.status(400).send({
            message: "FTP URL is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.port) {
        return res.status(400).send({
            message: "Port Number is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.login_name) {
        return res.status(400).send({
            message: "Login Name is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.password) {
        return res.status(400).send({
            message: "Password is Required"
        });
    }
    if((data.sync_type=="FTP" || data.sync_type=="FTP") && !data.folder) {
        return res.status(400).send({
            message: "folder path is Required"
        });
    }
    if((data.sync_type=="API" && api_type[0]==undefined || api_type[0]=="")) {
        return res.status(400).send({
            message: "API Type is Required"
        });
    }
    
    if(((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='DDEP_API')|| (data.sync_type=="API" && api_type[1]!=undefined && api_type[1]=='DDEP_API')) && data.api_ddep_api=="")
    {
        return res.status(400).send({
            message: "DDEP API URL is Required"
        });
    }
    if(((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='DDEP_API')|| (data.sync_type=="API" && api_type[1]!=undefined && api_type[1]=='DDEP_API')) && data.api_ddep_api!="")
    {
        var re = new RegExp(/^(\/)[a-zA-Z0-9-_\/]+$/);
        if (!re.test(data.api_ddep_api)) {
            return res.status(400).send({
                message: "DDEP API is not valid (must start with a '/' and must contain any letter, capitalize letter, number, dash or underscore)"
            });
        }
    }
    if((data.sync_type=="API" && api_type[0]!=undefined && api_type[0]=='User_API') && data.api_user_api=="")
    {
        return res.status(400).send({
            message: "User API URL is Required"
        });
    }

    data.createdBy="",
      data.updateBy = ""
    const inboundSetting = new InboundSetting({
        project_id: data.project_id, 
        inbound_format: data.inbound_format, 
        sync_type: data.sync_type,
        ftp_server_link: data.ftp_server_link,
        host: data.host,
        port: data.port,
        login_name: data.login_name,
        password: data.password,
        folder:data.folder,
        is_password_encrypted:data.is_password_encryptedm,
        backup_folder:data.backup_folder || "",
        is_active : data.is_active || "Inactive",
        api_type:data.api_type,
        api_user_api:data.api_user_api || "",
        api_ddep_api:data.api_ddep_api || "",
        createdBy:"",
        updateBy : ""
            
    });
    InboundSetting.findByIdAndUpdate(req.params.id,data, { new: true })
    .then((InboundSetting) => {
        //console.log(req.params.id);
      if (!InboundSetting) {
        return res.status(404).send({
          code: "1",
          MsgCode: "10002",
          MsgType: "Invalid-Source",
          MsgLang: "en",
          ShortMsg: "Update Fail",
          LongMsg: "Project not found",
          InternalMsg: "",
          EnableAlert: "No",
          DisplayMsgBy: "LongMsg",
          message: "no Project found",
          Data: []
        });
      }
      res.status(200).send({
          code: "0",
          MsgCode: "10001",
          MsgType: "Update-Data-Success",
          MsgLang: "en",
          ShortMsg: "Update Successful",
          LongMsg: "The Setting detail information was update successful",
          InternalMsg: "",
          EnableAlert: "No",
          DisplayMsgBy: "ShortMsg",
          message: "Setting update successfully",
          Data: []
      });
    })
    .catch((err) => {
      return res.status(404).send({
        code: "1",
        MsgCode: "50001",
        MsgType: "Exception-Error",
        MsgLang: "en",
        ShortMsg: "Update Fail",
        LongMsg: err.message || "Some error occurred while updating the project.",
        InternalMsg: "",
        EnableAlert: "No",
        DisplayMsgBy: "LongMsg",
        message: err.message || "Some error occurred while updating the project.",
        Data: []
      });
    });

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    InboundSetting.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {

            res.json({"Status":"0","Msg":"","ErrMsg":err,"Data":[]});
        }
        else
        {
            res.json({"Status":"1","Msg":"Deleted Successfully","ErrMsg":"","Data":[]});

        }
    });
};
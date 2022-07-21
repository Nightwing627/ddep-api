bodyParser = require('body-parser');
const OutboundValidation = require('../models/outbound_validation.model.js');

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
	var checkoutbound = isJson(data);
	if(checkoutbound) {
		data = JSON.parse(data);
	}

	if(!data.project_id) {
		return res.status(400).send({
			message: "Project Not Found"
		});
	}

	const outboundValidation = new OutboundValidation({
		item_id: data.project_id,
		validations: data.validations
	});
	outboundValidation.save()
	.then(data => {
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
			msg: "Validation Saved Successfully",
			id: data._id,
			Data: [],
		});
	}).catch(err => {
		res.status(500).send({
			code: "1",
			MsgCode: "50001",
			MsgType: "Exception-Error",
			MsgLang: "en",
			ShortMsg: "Save Fail",
			LongMsg: err.message || "Some error occurred while creating the validation.",
			InternalMsg: "",
			EnableAlert: "No",
			DisplayMsgBy: "LongMsg",
			message: err.message || "Some error occurred while creating the validation.",
			Data: [],
		});
	});
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
   	OutboundValidation.find()
	.then(OutboundValidation => {
		res.status(200).send({data:OutboundValidation})
	}).catch(err => {
		res.status(500).send({
			message: err.message || "Some error occurred while retrieving users."
		});
	});
};

exports.countAll = (req,res)=>{
	var query = OutboundValidation.find();
	query.count(function (err, count) {
	   res.status(200).send({total:count});
	});
}

// Find a single note with a noteId
exports.findOne = (req, res) => {
	const id = req.params.id;
	OutboundValidation.findOne({"item_id":id})
	.then(data => {
		if (!data) {
			res.status(404).json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Exception-Error",
				MsgLang: "en",
				ShortMsg: "Not Found",
				LongMsg: "Not found Item with id " + id,
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				message: "Not found Item with id " + id,
				Data: [],
			});
		} else {
			res.status(200).send({
				code: "0",
				MsgCode: "10001",
				MsgType: "Data-Success",
				MsgLang: "en",
				ShortMsg: "Get data",
				LongMsg: "The Setting detail information was get successful",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				msg: "Validation Get Successfully",
				id: data._id,
				Data: data,
			});
		}
	})
	.catch(err => {
		res
        .status(500)
        .json({code: "1", message: "Error retrieving Item with id=" + id });
	});
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
	console.log("outbound_validation", req.body, req.params.id)
	var data = req.body;
	var checkoutbound = isJson(data.OutboundValidation);

	if(checkoutbound)
	{
		data.OutboundValidation = JSON.parse(data.OutboundValidation);
	}

	if(!data.project_id) {
		return res.status(400).send({
			message: "Project Not found"
		});
	}

	var data1 = {
		item_id: data.project_id,
		validations: data.validations
	};

	OutboundValidation.findByIdAndUpdate(req.params.id, data1, { new: true })
	.then((OutboundValidation) => {
		if (!OutboundValidation) {
			return res.status(404).send({
				message: "no Project found"
			});
		}
		res.status(200).send({
			message:"Validation Updated Successfully"
		});
	})
	.catch((err) => {
		return res.status(404).send({
			message: "error while updating the Project",
			err:err
		});
	});
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
	OutboundValidation.findByIdAndRemove(req.params.id,function(err){
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
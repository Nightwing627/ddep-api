bodyParser = require("body-parser");
const MappingSetting = require("../models/mapping.model.js");
const config = require("../config/default");

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

	var checkmapping = isJson(data);

	if (checkmapping) {
		data.MappingSetting = JSON.parse(data);
	}

	if (!data.project_id) {
		return res.status(400).send({
			message: "Project Not Found",
		});
	}
	/*if (!data.inbound_format) {
		return res.status(400).send({
			message: "Inbound Format is Required",
		});
	}
	if (!data.outbound_format) {
		return res.status(400).send({
			message: "Outbound Format is Required",
		});
	}
	if (!data.mapping_data) {
		return res.status(400).send({
			message: "Mapping is Required",
		});
	}*/

	const mappingSetting = new MappingSetting({
		item_id: data.project_id,
		inbound_format: data.inbound_format,
		outbound_format: data.outbound_format,
		mapping_data: data.mapping_data,
		createdBy: config.userName,
		updateBy: config.userName,
	});
	mappingSetting
	.save()
	.then((data) => {
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
			Data: [],
		});
	})
	.catch((err) => {
		res.status(500).send({
			code: "1",
			MsgCode: "50001",
			MsgType: "Exception-Error",
			MsgLang: "en",
			ShortMsg: "Save Fail",
			LongMsg: err.message || "Some error occurred while save mapping data.",
			InternalMsg: "",
			EnableAlert: "No",
			DisplayMsgBy: "LongMsg",
			message: err.message || "Some error occurred while save mapping data.",
			Data: [],
		});
	});
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
	const id = req.params.id;

	MappingSetting.findOne({ item_id: id })
	.then((data) => {
		if (!data) {
			res.status(404).json({ message: "Not found Project with id " + id });
		} else {
			data = data._doc;
			data = { ...data, project_id: data.item_id };
			res.json(data);
		}
	})
	.catch((err) => {
		res
		.status(500)
		.json({ message: "Error retrieving Project with id=" + id });
	});
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
	var data = req.body;
	console.log("inbound_update", data, req.params.id);

	if (!data.project_id) {
		return res.status(400).send({
			message: "Project Not Found",
		});
	}
	/*if (!data.inbound_format) {
		return res.status(400).send({
			message: "Inbound Format is Required",
		});
	}
	if (!data.outbound_format) {
		return res.status(400).send({
			message: "Outbound Format is Required",
		});
	}
	if (!data.mapping_data) {
		return res.status(400).send({
			message: "Mapping is Required",
		});
	}*/

	var data1 = {};
	(data1.item_id = data.project_id),
	(data1.inbound_format = data.inbound_format),
	(data1.outbound_format = data.outbound_format),
	(data1.mapping_data = data.mapping_data),
	(data1.updateBy = config.userName);

	MappingSetting.findByIdAndUpdate(req.params.id, data1)
	.then((MappingSetting) => {
		if (!MappingSetting) {
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
				Data: [],
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
			Data: [],
		});
	})
	.catch((err) => {
		return res.status(404).send({
			code: "1",
			MsgCode: "50001",
			MsgType: "Exception-Error",
			MsgLang: "en",
			ShortMsg: "Update Fail",
			LongMsg: err.message || "Some error occurred while updating the mapping.",
			InternalMsg: "",
			EnableAlert: "No",
			DisplayMsgBy: "LongMsg",
			message: err.message || "Some error occurred while updating the mapping.",
			Data: [],
		});
	});
};
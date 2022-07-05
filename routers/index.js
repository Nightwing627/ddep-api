const config = require('../config/default');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var request = require('request');
const { transform, prettyPrint } = require('camaro');
var xpath = require('xpath');
var xmldom = require('xmldom');
var multer = require('multer');
var upload = multer();
var toJsonSchema = require('to-json-schema');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

var jsonSchemaGenerator = require('json-schema-generator'),
    obj = { some: { object: true } },
    schemaObj;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(upload.array());
router.use(express.static('public'));
router.use(bodyParser.text({ type: 'text/*' }));
router.use(bodyParser.raw({ type: 'application/*' }));
var fs = require('fs');

var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = ({}).constructor;

router.get('/', function(req, res, next) {
	res.redirect('/projects/project-list');
});

router.get('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	var typereq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	} else {
		newHeader['Content-Type'] = 'application/json';
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	}

	var queryString = '';
	Object.entries(reqQuery).forEach(([key, value]) => {
		if (queryString != '') {
			queryString += '&';
		}
		queryString += key+'='+value;
	});

	var ddepInput = '/'+req.params.ddepInput;
	var ddepInputArr = [];
	// ddepInput.push(req.params.ddepInput);
	var ddepInputCount = 1;
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		// ddepInput += '/'+req.params.ddepInput1;
		ddepInputArr.push(req.params.ddepInput1);
		ddepInputCount = 2;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		// ddepInput += '/'+req.params.ddepInput2;
		ddepInputArr.push(req.params.ddepInput2);
		ddepInputCount = 3;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		// ddepInput += '/'+req.params.ddepInput3;
		ddepInputArr.push(req.params.ddepInput3);
		ddepInputCount = 4;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		// ddepInput += '/'+req.params.ddepInput4;
		ddepInputArr.push(req.params.ddepInput4);
		ddepInputCount = 5;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		// ddepInput += '/'+req.params.ddepInput5;
		ddepInputArr.push(req.params.ddepInput5);
		ddepInputCount = 6;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		// ddepInput += '/'+req.params.ddepInput6;
		ddepInputArr.push(req.params.ddepInput6);
		ddepInputCount = 7;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		// ddepInput += '/'+req.params.ddepInput7;
		ddepInputArr.push(req.params.ddepInput7);
		ddepInputCount = 8;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		// ddepInput += '/'+req.params.ddepInput8;
		ddepInputArr.push(req.params.ddepInput8);
		ddepInputCount = 9;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		// ddepInput += '/'+req.params.ddepInput9;
		ddepInputArr.push(req.params.ddepInput9);
		ddepInputCount = 10;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var ddepInputPath = '';
	for (var i = 0; i < ddepInputArr.length; i++) {
		ddepInputPath += '/'+ddepInputArr[i];
	}

	var inpromise = new Promise(function(resolve, reject) {
		var inbound_options = {
			'method': 'POST',
			'url': inbound_url,
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
		}
		request(inbound_options, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var inbound_setting = JSON.parse(response.body);
			var project_id = '';
			var inbound_format = '';
			var outboundLastPath = '';
			if (inbound_setting.code != 0) {
				inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
				inbound_options = {
					'method': 'POST',
					'url': inbound_url,
					'headers': {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'ddepInput': ddepInput}),
				}
				request(inbound_options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					inbound_setting = JSON.parse(response.body);
					if (inbound_setting.code == 0) {
						var inbound_setting_data = inbound_setting.Data;
						var itemsArr = [];
						var inboundFormatArr = [];
						for (var i = 0; i < inbound_setting_data.length; i++) {
							itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
							inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
						}
						console.log("ITEMS_ARRAY => ");
						console.log(itemsArr);
						var newddepInputPath = ddepInput;
						var lastArrKey = 0;
						var ddepPath = '';
						for (var i = 0; i < ddepInputArr.length - 1; i++) {
							newddepInputPath += '/'+ddepInputArr[i];
							if (itemsArr[newddepInputPath] != undefined) {
								project_id = itemsArr[newddepInputPath];
								inbound_format = inboundFormatArr[newddepInputPath];
								lastArrKey = i;
								ddepPath = newddepInputPath;
							}
						}
						for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
							outboundLastPath += '/'+ddepInputArr[i];
						}
						console.log("DDEP_API_INPUT => " + ddepPath);
						console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
						resolve({
							code: "0",
							MsgCode: "10001",
							MsgType: "Get-Data-Success",
							MsgLang: "en",
							ShortMsg: "Get Success",
							LongMsg: "Found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							project_id : project_id,
							inbound_format : inbound_format,
							outboundLastPath : outboundLastPath
						});
					} else {
						return res.json({
							code: "1",
							MsgCode: "40001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Get Fail",
							LongMsg: "Not found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							Data: [],
						});
					}
				});
			} else {
				inbound_format = inbound_setting.Data.inbound_format;
				project_id = inbound_setting.Data.item_id;
				resolve({
					code: "0",
					MsgCode: "10001",
					MsgType: "Get-Data-Success",
					MsgLang: "en",
					ShortMsg: "Get Success",
					LongMsg: "Found Project with ddep api input",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "ShortMsg",
					project_id : project_id,
					inbound_format : inbound_format,
					outboundLastPath : outboundLastPath
				});
			}
		});
	});
	inpromise.then(function(result){
		if (result.code == 1) {
			return res.json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Get Fail",
				LongMsg: "Not found Project with ddep api input",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				Data: [],
			});
		} else {
			var project_id = result.project_id;
			var inbound_format = result.inbound_format;
			var outboundLastPath = result.outboundLastPath;
			console.log(project_id);
			console.log(inbound_format);
			console.log(outboundLastPath);
			var OutboundFormatData = {};
			var nodeDataArray = [];
			var linkDataArray = [];
			var outboundMappedData = {};
			var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
			request(mapping_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (Object.entries(reqBody).length > 0) {
					var inboundPostData = reqBody;
					if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
						inboundPostData = JSON.parse(reqBody);
					}
					console.log('Inbound posted Json:');
					console.log(inboundPostData);

					var mappingSetting = JSON.parse(body);
					if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
						OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
						var mapping_data = JSON.parse(mappingSetting.mapping_data);
						nodeDataArray = mapping_data.nodeDataArray;
						linkDataArray = mapping_data.linkDataArray;

						var linkdataarray = linkDataArray;
						var newLinkDataArr = [];
						var newLinkDataArrCount = [];
						for (var i = 0; i < linkdataarray.length; i++) {
							if (Object.entries(linkdataarray[i]).length > 0) {
								if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
									var linkdataarraykey = linkdataarray[i].to;
									var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
									if (linkdataarraykeycount > 1) {
										linkdataarraykey += linkdataarraykeycount;
									}
									newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
									newLinkDataArrCount.push(linkdataarraykey);
								}
							}
						}
						// console.log('newLinkDataArr:');
						// console.log(newLinkDataArr);

						if (newLinkDataArrCount.length > 0) {
							var mappingInboound = [];
							for (var key in newLinkDataArr) {
								var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
								mappingInboound[key] = inboundValue;
							}
							// console.log('mappingInboound:');
							// console.log(mappingInboound);

							var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
							console.log('Outbound format convert to replacement Format:');
							console.log(outboundFormatData);

							outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
							console.log('Outbound Final Result:');
							console.log(outboundMappedData);
							if (bodyreq != '' && outboundMappedData.length != 0) {
								bodyreq = outboundMappedData;
							}
							if (outboundMappedData.length != 0) {
								reqBody = outboundMappedData;
							}
						}
					}
				}

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					outboundSetting = JSON.parse(response.body);
					outbound_api_url = outboundSetting.api_url;

					if (outboundLastPath != '') {
						outbound_api_url += outboundLastPath;
					}

					var oldheaders = newHeader;
					delete oldheaders.Host;
					delete oldheaders['Accept-Encoding'];
					delete oldheaders.Connection;
					delete oldheaders['Content-Length'];

					var options = {
						'method': responseBody.method,
						'url': outbound_api_url+'?'+queryString,
						'headers': oldheaders,
					};
					if (bodyreq != '') {
						if(typereq != '' && typereq[1] == 'json') {
							options['body'] = JSON.stringify(bodyreq);
						} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
							options['body'] = JSON.stringify(bodyreq);
						} else {
							options['body'] = JSON.stringify(bodyreq);
						}
					} else {
						options['formData'] = JSON.parse(JSON.stringify(reqBody));
						if(Object.entries(options.formData).length == 0) {
							options.method = "GET";
						}
					}

					request(options, function (error, response, body) {
						if(error) {
							return res.json({
								code: "1",
								MsgCode: "50001",
								MsgType: "Invalid-Source",
								MsgLang: "en",
								ShortMsg: "Fail",
								LongMsg: error.message || "Some error occurred while getting.",
								InternalMsg: "",
								EnableAlert: "No",
								DisplayMsgBy: "LongMsg",
								Data: []
							});
						}
						if (response.statusCode == 200) {
							var contentType = response.headers['content-type'];
							var types = contentType.split(';');
							var type = types[0].split('/');
							if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
								return res.status(200).json(JSON.parse(body));
							} else {
								return res.send(body);
							}
						} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
							return res.send(response.body);
						} else {
							return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
						}
					});
				});
			});
		}
	});

	/*var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inbound_setting = JSON.parse(response.body);
		var project_id = '';
		var inbound_format = '';
		var outboundLastPath = '';
		if (inbound_setting.code != 0) {
			inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
			inbound_options = {
				'method': 'POST',
				'url': inbound_url,
				'headers': {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'ddepInput': ddepInput}),
			}
			request(inbound_options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				inbound_setting = JSON.parse(response.body);
				if (inbound_setting.code == 0) {
					var inbound_setting_data = inbound_setting.Data;
					var itemsArr = [];
					var inboundFormatArr = [];
					for (var i = 0; i < inbound_setting_data.length; i++) {
						itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
						inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
					}
					console.log("ITEMS_ARRAY => ");
					console.log(itemsArr);
					var newddepInputPath = ddepInput;
					var lastArrKey = 0;
					var ddepPath = '';
					for (var i = 0; i < ddepInputArr.length - 1; i++) {
						newddepInputPath += '/'+ddepInputArr[i];
						if (itemsArr[newddepInputPath] != undefined) {
							project_id = itemsArr[newddepInputPath];
							inbound_format = inboundFormatArr[newddepInputPath];
							lastArrKey = i;
							ddepPath = newddepInputPath;
						}
					}
					for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
						outboundLastPath += '/'+ddepInputArr[i];
					}
					console.log("DDEP_API_INPUT => " + ddepPath);
					console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
				} else {
					return res.status(404).json({
						code: "1",
						MsgCode: "40001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Get Fail",
						LongMsg: "Not found Project with ddep api input",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "ShortMsg",
						Data: [],
					});
				}
			});
		} else {
			inbound_format = inbound_setting.Data.inbound_format;
			project_id = inbound_setting.Data.item_id;
		}

		var OutboundFormatData = {};
		var nodeDataArray = [];
		var linkDataArray = [];
		var outboundMappedData = {};
		var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
		request(mapping_url, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			if (Object.entries(reqBody).length > 0) {
				var inboundPostData = reqBody;
				if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
					inboundPostData = JSON.parse(reqBody);
				}
				console.log('Inbound posted Json:');
				console.log(inboundPostData);

				var mappingSetting = JSON.parse(body);
				if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
					OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
					var mapping_data = JSON.parse(mappingSetting.mapping_data);
					nodeDataArray = mapping_data.nodeDataArray;
					linkDataArray = mapping_data.linkDataArray;

					var linkdataarray = linkDataArray;
					var newLinkDataArr = [];
					var newLinkDataArrCount = [];
					for (var i = 0; i < linkdataarray.length; i++) {
						if (Object.entries(linkdataarray[i]).length > 0) {
							if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
								var linkdataarraykey = linkdataarray[i].to;
								var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
								if (linkdataarraykeycount > 1) {
									linkdataarraykey += linkdataarraykeycount;
								}
								newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
								newLinkDataArrCount.push(linkdataarraykey);
							}
						}
					}
					// console.log('newLinkDataArr:');
					// console.log(newLinkDataArr);

					var mappingInboound = [];
					for (var key in newLinkDataArr) {
						var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
						mappingInboound[key] = inboundValue;
					}
					// console.log('mappingInboound:');
					// console.log(mappingInboound);

					var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
					console.log('Outbound format convert to replacement Format:');
					console.log(outboundFormatData);

					outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
					console.log('Outbound Final Result:');
					console.log(outboundMappedData);
					if (bodyreq != '' && outboundMappedData.length != 0) {
						bodyreq = outboundMappedData;
					}
					if (outboundMappedData.length != 0) {
						reqBody = outboundMappedData;
					}
				}
			}

			var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
			request(outbound_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log('outbound body');
				console.log(response.body);
				outboundSetting = JSON.parse(response.body);
				outbound_api_url = outboundSetting.api_url;

				if (outboundLastPath != '') {
					outbound_api_url += outboundLastPath;
				}

				var oldheaders = newHeader;
				delete oldheaders.Host;
				delete oldheaders['Accept-Encoding'];
				delete oldheaders.Connection;
				delete oldheaders['Content-Length'];

				var options = {
					'method': responseBody.method,
					'url': outbound_api_url+'?'+queryString,
					'headers': oldheaders,
				};
				if (bodyreq != '') {
					if(typereq != '' && typereq[1] == 'json') {
						options['body'] = JSON.stringify(bodyreq);
					} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
						options['body'] = JSON.stringify(bodyreq);
					} else {
						options['body'] = JSON.stringify(bodyreq);
					}
				} else {
					options['formData'] = JSON.parse(JSON.stringify(reqBody));
					if(Object.entries(options.formData).length == 0) {
						options.method = "GET";
					}
				}

				request(options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					if (response.statusCode == 200) {
						var contentType = response.headers['content-type'];
						var types = contentType.split(';');
						var type = types[0].split('/');
						if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
							return res.status(200).json(JSON.parse(body));
						} else {
							return res.send(body);
						}
					} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
						return res.send(response.body);
					} else {
						return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
					}
				});
			});
		});
	});*/
});

router.post('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	var typereq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	} else {
		newHeader['Content-Type'] = 'application/json';
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	}

	var queryString = '';
	Object.entries(reqQuery).forEach(([key, value]) => {
		if (queryString != '') {
			queryString += '&';
		}
		queryString += key+'='+value;
	});

	var ddepInput = '/'+req.params.ddepInput;
	var ddepInputArr = [];
	// ddepInput.push(req.params.ddepInput);
	var ddepInputCount = 1;
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		// ddepInput += '/'+req.params.ddepInput1;
		ddepInputArr.push(req.params.ddepInput1);
		ddepInputCount = 2;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		// ddepInput += '/'+req.params.ddepInput2;
		ddepInputArr.push(req.params.ddepInput2);
		ddepInputCount = 3;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		// ddepInput += '/'+req.params.ddepInput3;
		ddepInputArr.push(req.params.ddepInput3);
		ddepInputCount = 4;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		// ddepInput += '/'+req.params.ddepInput4;
		ddepInputArr.push(req.params.ddepInput4);
		ddepInputCount = 5;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		// ddepInput += '/'+req.params.ddepInput5;
		ddepInputArr.push(req.params.ddepInput5);
		ddepInputCount = 6;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		// ddepInput += '/'+req.params.ddepInput6;
		ddepInputArr.push(req.params.ddepInput6);
		ddepInputCount = 7;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		// ddepInput += '/'+req.params.ddepInput7;
		ddepInputArr.push(req.params.ddepInput7);
		ddepInputCount = 8;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		// ddepInput += '/'+req.params.ddepInput8;
		ddepInputArr.push(req.params.ddepInput8);
		ddepInputCount = 9;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		// ddepInput += '/'+req.params.ddepInput9;
		ddepInputArr.push(req.params.ddepInput9);
		ddepInputCount = 10;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var ddepInputPath = '';
	for (var i = 0; i < ddepInputArr.length; i++) {
		ddepInputPath += '/'+ddepInputArr[i];
	}

	var inpromise = new Promise(function(resolve, reject) {
		var inbound_options = {
			'method': 'POST',
			'url': inbound_url,
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
		}
		request(inbound_options, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var inbound_setting = JSON.parse(response.body);
			var project_id = '';
			var inbound_format = '';
			var outboundLastPath = '';
			if (inbound_setting.code != 0) {
				inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
				inbound_options = {
					'method': 'POST',
					'url': inbound_url,
					'headers': {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'ddepInput': ddepInput}),
				}
				request(inbound_options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					inbound_setting = JSON.parse(response.body);
					if (inbound_setting.code == 0) {
						var inbound_setting_data = inbound_setting.Data;
						var itemsArr = [];
						var inboundFormatArr = [];
						for (var i = 0; i < inbound_setting_data.length; i++) {
							itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
							inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
						}
						console.log("ITEMS_ARRAY => ");
						console.log(itemsArr);
						var newddepInputPath = ddepInput;
						var lastArrKey = 0;
						var ddepPath = '';
						for (var i = 0; i < ddepInputArr.length - 1; i++) {
							newddepInputPath += '/'+ddepInputArr[i];
							if (itemsArr[newddepInputPath] != undefined) {
								project_id = itemsArr[newddepInputPath];
								inbound_format = inboundFormatArr[newddepInputPath];
								lastArrKey = i;
								ddepPath = newddepInputPath;
							}
						}
						for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
							outboundLastPath += '/'+ddepInputArr[i];
						}
						console.log("DDEP_API_INPUT => " + ddepPath);
						console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
						resolve({
							code: "0",
							MsgCode: "10001",
							MsgType: "Get-Data-Success",
							MsgLang: "en",
							ShortMsg: "Get Success",
							LongMsg: "Found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							project_id : project_id,
							inbound_format : inbound_format,
							outboundLastPath : outboundLastPath
						});
					} else {
						return res.json({
							code: "1",
							MsgCode: "40001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Get Fail",
							LongMsg: "Not found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							Data: [],
						});
					}
				});
			} else {
				inbound_format = inbound_setting.Data.inbound_format;
				project_id = inbound_setting.Data.item_id;
				resolve({
					code: "0",
					MsgCode: "10001",
					MsgType: "Get-Data-Success",
					MsgLang: "en",
					ShortMsg: "Get Success",
					LongMsg: "Found Project with ddep api input",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "ShortMsg",
					project_id : project_id,
					inbound_format : inbound_format,
					outboundLastPath : outboundLastPath
				});
			}
		});
	});
	inpromise.then(function(result){
		if (result.code == 1) {
			return res.json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Get Fail",
				LongMsg: "Not found Project with ddep api input",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				Data: [],
			});
		} else {
			var project_id = result.project_id;
			var inbound_format = result.inbound_format;
			var outboundLastPath = result.outboundLastPath;
			console.log(project_id);
			console.log(inbound_format);
			console.log(outboundLastPath);
			var OutboundFormatData = {};
			var nodeDataArray = [];
			var linkDataArray = [];
			var outboundMappedData = {};
			var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
			request(mapping_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (Object.entries(reqBody).length > 0) {
					var inboundPostData = reqBody;
					if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
						inboundPostData = JSON.parse(reqBody);
					}
					console.log('Inbound posted Json:');
					console.log(inboundPostData);

					var mappingSetting = JSON.parse(body);
					if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
						OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
						var mapping_data = JSON.parse(mappingSetting.mapping_data);
						nodeDataArray = mapping_data.nodeDataArray;
						linkDataArray = mapping_data.linkDataArray;

						var linkdataarray = linkDataArray;
						var newLinkDataArr = [];
						var newLinkDataArrCount = [];
						for (var i = 0; i < linkdataarray.length; i++) {
							if (Object.entries(linkdataarray[i]).length > 0) {
								if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
									var linkdataarraykey = linkdataarray[i].to;
									var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
									if (linkdataarraykeycount > 1) {
										linkdataarraykey += linkdataarraykeycount;
									}
									newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
									newLinkDataArrCount.push(linkdataarraykey);
								}
							}
						}
						// console.log('newLinkDataArr:');
						// console.log(newLinkDataArr);

						if (newLinkDataArrCount.length > 0) {
							var mappingInboound = [];
							for (var key in newLinkDataArr) {
								var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
								mappingInboound[key] = inboundValue;
							}
							// console.log('mappingInboound:');
							// console.log(mappingInboound);

							var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
							console.log('Outbound format convert to replacement Format:');
							console.log(outboundFormatData);

							outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
							console.log('Outbound Final Result:');
							console.log(outboundMappedData);
							if (bodyreq != '' && outboundMappedData.length != 0) {
								bodyreq = outboundMappedData;
							}
							if (outboundMappedData.length != 0) {
								reqBody = outboundMappedData;
							}
						}
					}
				}

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					outboundSetting = JSON.parse(response.body);
					outbound_api_url = outboundSetting.api_url;

					if (outboundLastPath != '') {
						outbound_api_url += outboundLastPath;
					}

					var oldheaders = newHeader;
					delete oldheaders.Host;
					delete oldheaders['Accept-Encoding'];
					delete oldheaders.Connection;
					delete oldheaders['Content-Length'];

					var options = {
						'method': responseBody.method,
						'url': outbound_api_url+'?'+queryString,
						'headers': oldheaders,
					};
					if (bodyreq != '') {
						if(typereq != '' && typereq[1] == 'json') {
							options['body'] = JSON.stringify(bodyreq);
						} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
							options['body'] = JSON.stringify(bodyreq);
						} else {
							options['body'] = JSON.stringify(bodyreq);
						}
					} else {
						options['formData'] = JSON.parse(JSON.stringify(reqBody));
						if(Object.entries(options.formData).length == 0) {
							options.method = "GET";
						}
					}

					request(options, function (error, response, body) {
						if(error) {
							return res.json({
								code: "1",
								MsgCode: "50001",
								MsgType: "Invalid-Source",
								MsgLang: "en",
								ShortMsg: "Fail",
								LongMsg: error.message || "Some error occurred while getting.",
								InternalMsg: "",
								EnableAlert: "No",
								DisplayMsgBy: "LongMsg",
								Data: []
							});
						}
						if (response.statusCode == 200) {
							var contentType = response.headers['content-type'];
							var types = contentType.split(';');
							var type = types[0].split('/');
							if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
								return res.status(200).json(JSON.parse(body));
							} else {
								return res.send(body);
							}
						} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
							return res.send(response.body);
						} else {
							return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
						}
					});
				});
			});
		}
	});

	/*var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inbound_setting = JSON.parse(response.body);
		var project_id = '';
		var inbound_format = '';
		var outboundLastPath = '';
		if (inbound_setting.code != 0) {
			inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
			inbound_options = {
				'method': 'POST',
				'url': inbound_url,
				'headers': {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'ddepInput': ddepInput}),
			}
			request(inbound_options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				inbound_setting = JSON.parse(response.body);
				if (inbound_setting.code == 0) {
					var inbound_setting_data = inbound_setting.Data;
					var itemsArr = [];
					var inboundFormatArr = [];
					for (var i = 0; i < inbound_setting_data.length; i++) {
						itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
						inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
					}
					console.log("ITEMS_ARRAY => ");
					console.log(itemsArr);
					var newddepInputPath = ddepInput;
					var lastArrKey = 0;
					var ddepPath = '';
					for (var i = 0; i < ddepInputArr.length - 1; i++) {
						newddepInputPath += '/'+ddepInputArr[i];
						if (itemsArr[newddepInputPath] != undefined) {
							project_id = itemsArr[newddepInputPath];
							inbound_format = inboundFormatArr[newddepInputPath];
							lastArrKey = i;
							ddepPath = newddepInputPath;
						}
					}
					for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
						outboundLastPath += '/'+ddepInputArr[i];
					}
					console.log("DDEP_API_INPUT => " + ddepPath);
					console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
				} else {
					return res.status(404).json({
						code: "1",
						MsgCode: "40001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Get Fail",
						LongMsg: "Not found Project with ddep api input",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "ShortMsg",
						Data: [],
					});
				}
			});
		} else {
			inbound_format = inbound_setting.Data.inbound_format;
			project_id = inbound_setting.Data.item_id;
		}

		var OutboundFormatData = {};
		var nodeDataArray = [];
		var linkDataArray = [];
		var outboundMappedData = {};
		var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
		request(mapping_url, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			if (Object.entries(reqBody).length > 0) {
				var inboundPostData = reqBody;
				if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
					inboundPostData = JSON.parse(reqBody);
				}
				console.log('Inbound posted Json:');
				console.log(inboundPostData);

				var mappingSetting = JSON.parse(body);
				if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
					OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
					var mapping_data = JSON.parse(mappingSetting.mapping_data);
					nodeDataArray = mapping_data.nodeDataArray;
					linkDataArray = mapping_data.linkDataArray;

					var linkdataarray = linkDataArray;
					var newLinkDataArr = [];
					var newLinkDataArrCount = [];
					for (var i = 0; i < linkdataarray.length; i++) {
						if (Object.entries(linkdataarray[i]).length > 0) {
							if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
								var linkdataarraykey = linkdataarray[i].to;
								var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
								if (linkdataarraykeycount > 1) {
									linkdataarraykey += linkdataarraykeycount;
								}
								newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
								newLinkDataArrCount.push(linkdataarraykey);
							}
						}
					}
					// console.log('newLinkDataArr:');
					// console.log(newLinkDataArr);

					var mappingInboound = [];
					for (var key in newLinkDataArr) {
						var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
						mappingInboound[key] = inboundValue;
					}
					// console.log('mappingInboound:');
					// console.log(mappingInboound);

					var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
					console.log('Outbound format convert to replacement Format:');
					console.log(outboundFormatData);

					outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
					console.log('Outbound Final Result:');
					console.log(outboundMappedData);
					if (bodyreq != '' && outboundMappedData.length != 0) {
						bodyreq = outboundMappedData;
					}
					if (outboundMappedData.length != 0) {
						reqBody = outboundMappedData;
					}
				}
			}

			var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
			request(outbound_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var outboundSetting = JSON.parse(body);
				var outbound_api_url = outboundSetting.api_url;

				if (outboundLastPath != '') {
					outbound_api_url += outboundLastPath;
				}

				var oldheaders = newHeader;
				delete oldheaders.Host;
				delete oldheaders['Accept-Encoding'];
				delete oldheaders.Connection;
				delete oldheaders['Content-Length'];

				var options = {
					'method': responseBody.method,
					'url': outbound_api_url+'?'+queryString,
					'headers': oldheaders,
				};
				if (bodyreq != '') {
					if(typereq != '' && typereq[1] == 'json') {
						options['body'] = JSON.stringify(bodyreq);
					} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
						options['body'] = JSON.stringify(bodyreq);
					} else {
						options['body'] = JSON.stringify(bodyreq);
					}
				} else {
					options['formData'] = JSON.parse(JSON.stringify(reqBody));
					if(Object.entries(options.formData).length == 0) {
						options.method = "GET";
					}
				}

				request(options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					if (response.statusCode == 200) {
						var contentType = response.headers['content-type'];
						var types = contentType.split(';');
						var type = types[0].split('/');
						if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
							return res.status(200).json(JSON.parse(body));
						} else {
							return res.send(body);
						}
					} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
						return res.send(response.body);
					} else {
						return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
					}
				});
			});
		});
	});*/
});

router.put('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	var typereq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	} else {
		newHeader['Content-Type'] = 'application/json';
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	}

	var queryString = '';
	Object.entries(reqQuery).forEach(([key, value]) => {
		if (queryString != '') {
			queryString += '&';
		}
		queryString += key+'='+value;
	});

	var ddepInput = '/'+req.params.ddepInput;
	var ddepInputArr = [];
	// ddepInput.push(req.params.ddepInput);
	var ddepInputCount = 1;
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		// ddepInput += '/'+req.params.ddepInput1;
		ddepInputArr.push(req.params.ddepInput1);
		ddepInputCount = 2;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		// ddepInput += '/'+req.params.ddepInput2;
		ddepInputArr.push(req.params.ddepInput2);
		ddepInputCount = 3;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		// ddepInput += '/'+req.params.ddepInput3;
		ddepInputArr.push(req.params.ddepInput3);
		ddepInputCount = 4;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		// ddepInput += '/'+req.params.ddepInput4;
		ddepInputArr.push(req.params.ddepInput4);
		ddepInputCount = 5;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		// ddepInput += '/'+req.params.ddepInput5;
		ddepInputArr.push(req.params.ddepInput5);
		ddepInputCount = 6;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		// ddepInput += '/'+req.params.ddepInput6;
		ddepInputArr.push(req.params.ddepInput6);
		ddepInputCount = 7;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		// ddepInput += '/'+req.params.ddepInput7;
		ddepInputArr.push(req.params.ddepInput7);
		ddepInputCount = 8;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		// ddepInput += '/'+req.params.ddepInput8;
		ddepInputArr.push(req.params.ddepInput8);
		ddepInputCount = 9;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		// ddepInput += '/'+req.params.ddepInput9;
		ddepInputArr.push(req.params.ddepInput9);
		ddepInputCount = 10;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var ddepInputPath = '';
	for (var i = 0; i < ddepInputArr.length; i++) {
		ddepInputPath += '/'+ddepInputArr[i];
	}

	var inpromise = new Promise(function(resolve, reject) {
		var inbound_options = {
			'method': 'POST',
			'url': inbound_url,
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
		}
		request(inbound_options, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var inbound_setting = JSON.parse(response.body);
			var project_id = '';
			var inbound_format = '';
			var outboundLastPath = '';
			if (inbound_setting.code != 0) {
				inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
				inbound_options = {
					'method': 'POST',
					'url': inbound_url,
					'headers': {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'ddepInput': ddepInput}),
				}
				request(inbound_options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					inbound_setting = JSON.parse(response.body);
					if (inbound_setting.code == 0) {
						var inbound_setting_data = inbound_setting.Data;
						var itemsArr = [];
						var inboundFormatArr = [];
						for (var i = 0; i < inbound_setting_data.length; i++) {
							itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
							inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
						}
						console.log("ITEMS_ARRAY => ");
						console.log(itemsArr);
						var newddepInputPath = ddepInput;
						var lastArrKey = 0;
						var ddepPath = '';
						for (var i = 0; i < ddepInputArr.length - 1; i++) {
							newddepInputPath += '/'+ddepInputArr[i];
							if (itemsArr[newddepInputPath] != undefined) {
								project_id = itemsArr[newddepInputPath];
								inbound_format = inboundFormatArr[newddepInputPath];
								lastArrKey = i;
								ddepPath = newddepInputPath;
							}
						}
						for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
							outboundLastPath += '/'+ddepInputArr[i];
						}
						console.log("DDEP_API_INPUT => " + ddepPath);
						console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
						resolve({
							code: "0",
							MsgCode: "10001",
							MsgType: "Get-Data-Success",
							MsgLang: "en",
							ShortMsg: "Get Success",
							LongMsg: "Found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							project_id : project_id,
							inbound_format : inbound_format,
							outboundLastPath : outboundLastPath
						});
					} else {
						return res.json({
							code: "1",
							MsgCode: "40001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Get Fail",
							LongMsg: "Not found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							Data: [],
						});
					}
				});
			} else {
				inbound_format = inbound_setting.Data.inbound_format;
				project_id = inbound_setting.Data.item_id;
				resolve({
					code: "0",
					MsgCode: "10001",
					MsgType: "Get-Data-Success",
					MsgLang: "en",
					ShortMsg: "Get Success",
					LongMsg: "Found Project with ddep api input",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "ShortMsg",
					project_id : project_id,
					inbound_format : inbound_format,
					outboundLastPath : outboundLastPath
				});
			}
		});
	});
	inpromise.then(function(result){
		if (result.code == 1) {
			return res.json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Get Fail",
				LongMsg: "Not found Project with ddep api input",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				Data: [],
			});
		} else {
			var project_id = result.project_id;
			var inbound_format = result.inbound_format;
			var outboundLastPath = result.outboundLastPath;
			console.log(project_id);
			console.log(inbound_format);
			console.log(outboundLastPath);
			var OutboundFormatData = {};
			var nodeDataArray = [];
			var linkDataArray = [];
			var outboundMappedData = {};
			var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
			request(mapping_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (Object.entries(reqBody).length > 0) {
					var inboundPostData = reqBody;
					if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
						inboundPostData = JSON.parse(reqBody);
					}
					console.log('Inbound posted Json:');
					console.log(inboundPostData);

					var mappingSetting = JSON.parse(body);
					if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
						OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
						var mapping_data = JSON.parse(mappingSetting.mapping_data);
						nodeDataArray = mapping_data.nodeDataArray;
						linkDataArray = mapping_data.linkDataArray;

						var linkdataarray = linkDataArray;
						var newLinkDataArr = [];
						var newLinkDataArrCount = [];
						for (var i = 0; i < linkdataarray.length; i++) {
							if (Object.entries(linkdataarray[i]).length > 0) {
								if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
									var linkdataarraykey = linkdataarray[i].to;
									var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
									if (linkdataarraykeycount > 1) {
										linkdataarraykey += linkdataarraykeycount;
									}
									newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
									newLinkDataArrCount.push(linkdataarraykey);
								}
							}
						}
						// console.log('newLinkDataArr:');
						// console.log(newLinkDataArr);

						if (newLinkDataArrCount.length > 0) {
							var mappingInboound = [];
							for (var key in newLinkDataArr) {
								var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
								mappingInboound[key] = inboundValue;
							}
							// console.log('mappingInboound:');
							// console.log(mappingInboound);

							var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
							console.log('Outbound format convert to replacement Format:');
							console.log(outboundFormatData);

							outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
							console.log('Outbound Final Result:');
							console.log(outboundMappedData);
							if (bodyreq != '' && outboundMappedData.length != 0) {
								bodyreq = outboundMappedData;
							}
							if (outboundMappedData.length != 0) {
								reqBody = outboundMappedData;
							}
						}
					}
				}

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					outboundSetting = JSON.parse(response.body);
					outbound_api_url = outboundSetting.api_url;

					if (outboundLastPath != '') {
						outbound_api_url += outboundLastPath;
					}

					var oldheaders = newHeader;
					delete oldheaders.Host;
					delete oldheaders['Accept-Encoding'];
					delete oldheaders.Connection;
					delete oldheaders['Content-Length'];

					var options = {
						'method': responseBody.method,
						'url': outbound_api_url+'?'+queryString,
						'headers': oldheaders,
					};
					if (bodyreq != '') {
						if(typereq != '' && typereq[1] == 'json') {
							options['body'] = JSON.stringify(bodyreq);
						} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
							options['body'] = JSON.stringify(bodyreq);
						} else {
							options['body'] = JSON.stringify(bodyreq);
						}
					} else {
						options['formData'] = JSON.parse(JSON.stringify(reqBody));
						if(Object.entries(options.formData).length == 0) {
							options.method = "GET";
						}
					}

					request(options, function (error, response, body) {
						if(error) {
							return res.json({
								code: "1",
								MsgCode: "50001",
								MsgType: "Invalid-Source",
								MsgLang: "en",
								ShortMsg: "Fail",
								LongMsg: error.message || "Some error occurred while getting.",
								InternalMsg: "",
								EnableAlert: "No",
								DisplayMsgBy: "LongMsg",
								Data: []
							});
						}
						if (response.statusCode == 200) {
							var contentType = response.headers['content-type'];
							var types = contentType.split(';');
							var type = types[0].split('/');
							if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
								return res.status(200).json(JSON.parse(body));
							} else {
								return res.send(body);
							}
						} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
							return res.send(response.body);
						} else {
							return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
						}
					});
				});
			});
		}
	});

	/*var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inbound_setting = JSON.parse(response.body);
		var project_id = '';
		var inbound_format = '';
		var outboundLastPath = '';
		if (inbound_setting.code != 0) {
			inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
			inbound_options = {
				'method': 'POST',
				'url': inbound_url,
				'headers': {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'ddepInput': ddepInput}),
			}
			request(inbound_options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				inbound_setting = JSON.parse(response.body);
				if (inbound_setting.code == 0) {
					var inbound_setting_data = inbound_setting.Data;
					var itemsArr = [];
					var inboundFormatArr = [];
					for (var i = 0; i < inbound_setting_data.length; i++) {
						itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
						inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
					}
					console.log("ITEMS_ARRAY => ");
					console.log(itemsArr);
					var newddepInputPath = ddepInput;
					var lastArrKey = 0;
					var ddepPath = '';
					for (var i = 0; i < ddepInputArr.length - 1; i++) {
						newddepInputPath += '/'+ddepInputArr[i];
						if (itemsArr[newddepInputPath] != undefined) {
							project_id = itemsArr[newddepInputPath];
							inbound_format = inboundFormatArr[newddepInputPath];
							lastArrKey = i;
							ddepPath = newddepInputPath;
						}
					}
					for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
						outboundLastPath += '/'+ddepInputArr[i];
					}
					console.log("DDEP_API_INPUT => " + ddepPath);
					console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
				} else {
					return res.status(404).json({
						code: "1",
						MsgCode: "40001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Get Fail",
						LongMsg: "Not found Project with ddep api input",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "ShortMsg",
						Data: [],
					});
				}
			});
		} else {
			inbound_format = inbound_setting.Data.inbound_format;
			project_id = inbound_setting.Data.item_id;
		}

		var OutboundFormatData = {};
		var nodeDataArray = [];
		var linkDataArray = [];
		var outboundMappedData = {};
		var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
		request(mapping_url, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			if (Object.entries(reqBody).length > 0) {
				var inboundPostData = reqBody;
				if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
					inboundPostData = JSON.parse(reqBody);
				}
				console.log('Inbound posted Json:');
				console.log(inboundPostData);

				var mappingSetting = JSON.parse(body);
				if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
					OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
					var mapping_data = JSON.parse(mappingSetting.mapping_data);
					nodeDataArray = mapping_data.nodeDataArray;
					linkDataArray = mapping_data.linkDataArray;

					var linkdataarray = linkDataArray;
					var newLinkDataArr = [];
					var newLinkDataArrCount = [];
					for (var i = 0; i < linkdataarray.length; i++) {
						if (Object.entries(linkdataarray[i]).length > 0) {
							if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
								var linkdataarraykey = linkdataarray[i].to;
								var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
								if (linkdataarraykeycount > 1) {
									linkdataarraykey += linkdataarraykeycount;
								}
								newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
								newLinkDataArrCount.push(linkdataarraykey);
							}
						}
					}
					// console.log('newLinkDataArr:');
					// console.log(newLinkDataArr);

					var mappingInboound = [];
					for (var key in newLinkDataArr) {
						var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
						mappingInboound[key] = inboundValue;
					}
					// console.log('mappingInboound:');
					// console.log(mappingInboound);

					var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
					console.log('Outbound format convert to replacement Format:');
					console.log(outboundFormatData);

					outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
					console.log('Outbound Final Result:');
					console.log(outboundMappedData);
					if (bodyreq != '' && outboundMappedData.length != 0) {
						bodyreq = outboundMappedData;
					}
					if (outboundMappedData.length != 0) {
						reqBody = outboundMappedData;
					}
				}
			}

			var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
			request(outbound_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var outboundSetting = JSON.parse(body);
				var outbound_api_url = outboundSetting.api_url;

				if (outboundLastPath != '') {
					outbound_api_url += outboundLastPath;
				}

				var oldheaders = newHeader;
				delete oldheaders.Host;
				delete oldheaders['Accept-Encoding'];
				delete oldheaders.Connection;
				delete oldheaders['Content-Length'];

				var options = {
					'method': responseBody.method,
					'url': outbound_api_url+'?'+queryString,
					'headers': oldheaders,
				};
				if (bodyreq != '') {
					if(typereq != '' && typereq[1] == 'json') {
						options['body'] = JSON.stringify(bodyreq);
					} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
						options['body'] = JSON.stringify(bodyreq);
					} else {
						options['body'] = JSON.stringify(bodyreq);
					}
				} else {
					options['formData'] = JSON.parse(JSON.stringify(reqBody));
					if(Object.entries(options.formData).length == 0) {
						options.method = "GET";
					}
				}

				request(options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					if (response.statusCode == 200) {
						var contentType = response.headers['content-type'];
						var types = contentType.split(';');
						var type = types[0].split('/');
						if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
							return res.status(200).json(JSON.parse(body));
						} else {
							return res.send(body);
						}
					} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
						return res.send(response.body);
					} else {
						return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
					}
				});
			});
		});
	});*/
});

router.delete('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	var typereq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	} else {
		newHeader['Content-Type'] = 'application/json';
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	}

	var queryString = '';
	Object.entries(reqQuery).forEach(([key, value]) => {
		if (queryString != '') {
			queryString += '&';
		}
		queryString += key+'='+value;
	});

	var ddepInput = '/'+req.params.ddepInput;
	var ddepInputArr = [];
	// ddepInput.push(req.params.ddepInput);
	var ddepInputCount = 1;
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		// ddepInput += '/'+req.params.ddepInput1;
		ddepInputArr.push(req.params.ddepInput1);
		ddepInputCount = 2;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		// ddepInput += '/'+req.params.ddepInput2;
		ddepInputArr.push(req.params.ddepInput2);
		ddepInputCount = 3;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		// ddepInput += '/'+req.params.ddepInput3;
		ddepInputArr.push(req.params.ddepInput3);
		ddepInputCount = 4;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		// ddepInput += '/'+req.params.ddepInput4;
		ddepInputArr.push(req.params.ddepInput4);
		ddepInputCount = 5;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		// ddepInput += '/'+req.params.ddepInput5;
		ddepInputArr.push(req.params.ddepInput5);
		ddepInputCount = 6;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		// ddepInput += '/'+req.params.ddepInput6;
		ddepInputArr.push(req.params.ddepInput6);
		ddepInputCount = 7;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		// ddepInput += '/'+req.params.ddepInput7;
		ddepInputArr.push(req.params.ddepInput7);
		ddepInputCount = 8;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		// ddepInput += '/'+req.params.ddepInput8;
		ddepInputArr.push(req.params.ddepInput8);
		ddepInputCount = 9;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		// ddepInput += '/'+req.params.ddepInput9;
		ddepInputArr.push(req.params.ddepInput9);
		ddepInputCount = 10;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var ddepInputPath = '';
	for (var i = 0; i < ddepInputArr.length; i++) {
		ddepInputPath += '/'+ddepInputArr[i];
	}

	var inpromise = new Promise(function(resolve, reject) {
		var inbound_options = {
			'method': 'POST',
			'url': inbound_url,
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
		}
		request(inbound_options, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var inbound_setting = JSON.parse(response.body);
			var project_id = '';
			var inbound_format = '';
			var outboundLastPath = '';
			if (inbound_setting.code != 0) {
				inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
				inbound_options = {
					'method': 'POST',
					'url': inbound_url,
					'headers': {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'ddepInput': ddepInput}),
				}
				request(inbound_options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					inbound_setting = JSON.parse(response.body);
					if (inbound_setting.code == 0) {
						var inbound_setting_data = inbound_setting.Data;
						var itemsArr = [];
						var inboundFormatArr = [];
						for (var i = 0; i < inbound_setting_data.length; i++) {
							itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
							inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
						}
						console.log("ITEMS_ARRAY => ");
						console.log(itemsArr);
						var newddepInputPath = ddepInput;
						var lastArrKey = 0;
						var ddepPath = '';
						for (var i = 0; i < ddepInputArr.length - 1; i++) {
							newddepInputPath += '/'+ddepInputArr[i];
							if (itemsArr[newddepInputPath] != undefined) {
								project_id = itemsArr[newddepInputPath];
								inbound_format = inboundFormatArr[newddepInputPath];
								lastArrKey = i;
								ddepPath = newddepInputPath;
							}
						}
						for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
							outboundLastPath += '/'+ddepInputArr[i];
						}
						console.log("DDEP_API_INPUT => " + ddepPath);
						console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
						resolve({
							code: "0",
							MsgCode: "10001",
							MsgType: "Get-Data-Success",
							MsgLang: "en",
							ShortMsg: "Get Success",
							LongMsg: "Found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							project_id : project_id,
							inbound_format : inbound_format,
							outboundLastPath : outboundLastPath
						});
					} else {
						return res.json({
							code: "1",
							MsgCode: "40001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Get Fail",
							LongMsg: "Not found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							Data: [],
						});
					}
				});
			} else {
				inbound_format = inbound_setting.Data.inbound_format;
				project_id = inbound_setting.Data.item_id;
				resolve({
					code: "0",
					MsgCode: "10001",
					MsgType: "Get-Data-Success",
					MsgLang: "en",
					ShortMsg: "Get Success",
					LongMsg: "Found Project with ddep api input",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "ShortMsg",
					project_id : project_id,
					inbound_format : inbound_format,
					outboundLastPath : outboundLastPath
				});
			}
		});
	});
	inpromise.then(function(result){
		if (result.code == 1) {
			return res.json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Get Fail",
				LongMsg: "Not found Project with ddep api input",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				Data: [],
			});
		} else {
			var project_id = result.project_id;
			var inbound_format = result.inbound_format;
			var outboundLastPath = result.outboundLastPath;
			console.log(project_id);
			console.log(inbound_format);
			console.log(outboundLastPath);
			var OutboundFormatData = {};
			var nodeDataArray = [];
			var linkDataArray = [];
			var outboundMappedData = {};
			var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
			request(mapping_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (Object.entries(reqBody).length > 0) {
					var inboundPostData = reqBody;
					if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
						inboundPostData = JSON.parse(reqBody);
					}
					console.log('Inbound posted Json:');
					console.log(inboundPostData);

					var mappingSetting = JSON.parse(body);
					if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
						OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
						var mapping_data = JSON.parse(mappingSetting.mapping_data);
						nodeDataArray = mapping_data.nodeDataArray;
						linkDataArray = mapping_data.linkDataArray;

						var linkdataarray = linkDataArray;
						var newLinkDataArr = [];
						var newLinkDataArrCount = [];
						for (var i = 0; i < linkdataarray.length; i++) {
							if (Object.entries(linkdataarray[i]).length > 0) {
								if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
									var linkdataarraykey = linkdataarray[i].to;
									var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
									if (linkdataarraykeycount > 1) {
										linkdataarraykey += linkdataarraykeycount;
									}
									newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
									newLinkDataArrCount.push(linkdataarraykey);
								}
							}
						}
						// console.log('newLinkDataArr:');
						// console.log(newLinkDataArr);

						if (newLinkDataArrCount.length > 0) {
							var mappingInboound = [];
							for (var key in newLinkDataArr) {
								var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
								mappingInboound[key] = inboundValue;
							}
							// console.log('mappingInboound:');
							// console.log(mappingInboound);

							var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
							console.log('Outbound format convert to replacement Format:');
							console.log(outboundFormatData);

							outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
							console.log('Outbound Final Result:');
							console.log(outboundMappedData);
							if (bodyreq != '' && outboundMappedData.length != 0) {
								bodyreq = outboundMappedData;
							}
							if (outboundMappedData.length != 0) {
								reqBody = outboundMappedData;
							}
						}
					}
				}

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					outboundSetting = JSON.parse(response.body);
					outbound_api_url = outboundSetting.api_url;

					if (outboundLastPath != '') {
						outbound_api_url += outboundLastPath;
					}

					var oldheaders = newHeader;
					delete oldheaders.Host;
					delete oldheaders['Accept-Encoding'];
					delete oldheaders.Connection;
					delete oldheaders['Content-Length'];

					var options = {
						'method': responseBody.method,
						'url': outbound_api_url+'?'+queryString,
						'headers': oldheaders,
					};
					if (bodyreq != '') {
						if(typereq != '' && typereq[1] == 'json') {
							options['body'] = JSON.stringify(bodyreq);
						} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
							options['body'] = JSON.stringify(bodyreq);
						} else {
							options['body'] = JSON.stringify(bodyreq);
						}
					} else {
						options['formData'] = JSON.parse(JSON.stringify(reqBody));
						if(Object.entries(options.formData).length == 0) {
							options.method = "GET";
						}
					}

					request(options, function (error, response, body) {
						if(error) {
							return res.json({
								code: "1",
								MsgCode: "50001",
								MsgType: "Invalid-Source",
								MsgLang: "en",
								ShortMsg: "Fail",
								LongMsg: error.message || "Some error occurred while getting.",
								InternalMsg: "",
								EnableAlert: "No",
								DisplayMsgBy: "LongMsg",
								Data: []
							});
						}
						if (response.statusCode == 200) {
							var contentType = response.headers['content-type'];
							var types = contentType.split(';');
							var type = types[0].split('/');
							if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
								return res.status(200).json(JSON.parse(body));
							} else {
								return res.send(body);
							}
						} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
							return res.send(response.body);
						} else {
							return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
						}
					});
				});
			});
		}
	});

	/*var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inbound_setting = JSON.parse(response.body);
		var project_id = '';
		var inbound_format = '';
		var outboundLastPath = '';
		if (inbound_setting.code != 0) {
			inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
			inbound_options = {
				'method': 'POST',
				'url': inbound_url,
				'headers': {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'ddepInput': ddepInput}),
			}
			request(inbound_options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				inbound_setting = JSON.parse(response.body);
				if (inbound_setting.code == 0) {
					var inbound_setting_data = inbound_setting.Data;
					var itemsArr = [];
					var inboundFormatArr = [];
					for (var i = 0; i < inbound_setting_data.length; i++) {
						itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
						inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
					}
					console.log("ITEMS_ARRAY => ");
					console.log(itemsArr);
					var newddepInputPath = ddepInput;
					var lastArrKey = 0;
					var ddepPath = '';
					for (var i = 0; i < ddepInputArr.length - 1; i++) {
						newddepInputPath += '/'+ddepInputArr[i];
						if (itemsArr[newddepInputPath] != undefined) {
							project_id = itemsArr[newddepInputPath];
							inbound_format = inboundFormatArr[newddepInputPath];
							lastArrKey = i;
							ddepPath = newddepInputPath;
						}
					}
					for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
						outboundLastPath += '/'+ddepInputArr[i];
					}
					console.log("DDEP_API_INPUT => " + ddepPath);
					console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
				} else {
					return res.status(404).json({
						code: "1",
						MsgCode: "40001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Get Fail",
						LongMsg: "Not found Project with ddep api input",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "ShortMsg",
						Data: [],
					});
				}
			});
		} else {
			inbound_format = inbound_setting.Data.inbound_format;
			project_id = inbound_setting.Data.item_id;
		}

		var OutboundFormatData = {};
		var nodeDataArray = [];
		var linkDataArray = [];
		var outboundMappedData = {};
		var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
		request(mapping_url, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			if (Object.entries(reqBody).length > 0) {
				var inboundPostData = reqBody;
				if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
					inboundPostData = JSON.parse(reqBody);
				}
				console.log('Inbound posted Json:');
				console.log(inboundPostData);

				var mappingSetting = JSON.parse(body);
				if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
					OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
					var mapping_data = JSON.parse(mappingSetting.mapping_data);
					nodeDataArray = mapping_data.nodeDataArray;
					linkDataArray = mapping_data.linkDataArray;

					var linkdataarray = linkDataArray;
					var newLinkDataArr = [];
					var newLinkDataArrCount = [];
					for (var i = 0; i < linkdataarray.length; i++) {
						if (Object.entries(linkdataarray[i]).length > 0) {
							if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
								var linkdataarraykey = linkdataarray[i].to;
								var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
								if (linkdataarraykeycount > 1) {
									linkdataarraykey += linkdataarraykeycount;
								}
								newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
								newLinkDataArrCount.push(linkdataarraykey);
							}
						}
					}
					// console.log('newLinkDataArr:');
					// console.log(newLinkDataArr);

					var mappingInboound = [];
					for (var key in newLinkDataArr) {
						var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
						mappingInboound[key] = inboundValue;
					}
					// console.log('mappingInboound:');
					// console.log(mappingInboound);

					var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
					console.log('Outbound format convert to replacement Format:');
					console.log(outboundFormatData);

					outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
					console.log('Outbound Final Result:');
					console.log(outboundMappedData);
					if (bodyreq != '' && outboundMappedData.length != 0) {
						bodyreq = outboundMappedData;
					}
					if (outboundMappedData.length != 0) {
						reqBody = outboundMappedData;
					}
				}
			}

			var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
			request(outbound_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var outboundSetting = JSON.parse(body);
				var outbound_api_url = outboundSetting.api_url;

				if (outboundLastPath != '') {
					outbound_api_url += outboundLastPath;
				}

				var oldheaders = newHeader;
				delete oldheaders.Host;
				delete oldheaders['Accept-Encoding'];
				delete oldheaders.Connection;
				delete oldheaders['Content-Length'];

				var options = {
					'method': responseBody.method,
					'url': outbound_api_url+'?'+queryString,
					'headers': oldheaders,
				};
				if (bodyreq != '') {
					if(typereq != '' && typereq[1] == 'json') {
						options['body'] = JSON.stringify(bodyreq);
					} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
						options['body'] = JSON.stringify(bodyreq);
					} else {
						options['body'] = JSON.stringify(bodyreq);
					}
				} else {
					options['formData'] = JSON.parse(JSON.stringify(reqBody));
					if(Object.entries(options.formData).length == 0) {
						options.method = "GET";
					}
				}

				request(options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					if (response.statusCode == 200) {
						var contentType = response.headers['content-type'];
						var types = contentType.split(';');
						var type = types[0].split('/');
						if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
							return res.status(200).json(JSON.parse(body));
						} else {
							return res.send(body);
						}
					} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
						return res.send(response.body);
					} else {
						return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
					}
				});
			});
		});
	});*/
});

router.patch('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	var typereq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	} else {
		newHeader['Content-Type'] = 'application/json';
		var reqContentType = newHeader['Content-Type'];
		typereq = reqContentType.split('/');
		if ((typereq[0] == 'application' && (typereq[1] == 'json' || typereq[1] == 'xml' || typereq[1] == 'javascript')) || (typereq[0] == 'text' && (typereq[1] == 'plain' || typereq[1] == 'html'))) {
			bodyreq = reqBody;
		}
	}

	var queryString = '';
	Object.entries(reqQuery).forEach(([key, value]) => {
		if (queryString != '') {
			queryString += '&';
		}
		queryString += key+'='+value;
	});

	var ddepInput = '/'+req.params.ddepInput;
	var ddepInputArr = [];
	// ddepInput.push(req.params.ddepInput);
	var ddepInputCount = 1;
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		// ddepInput += '/'+req.params.ddepInput1;
		ddepInputArr.push(req.params.ddepInput1);
		ddepInputCount = 2;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		// ddepInput += '/'+req.params.ddepInput2;
		ddepInputArr.push(req.params.ddepInput2);
		ddepInputCount = 3;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		// ddepInput += '/'+req.params.ddepInput3;
		ddepInputArr.push(req.params.ddepInput3);
		ddepInputCount = 4;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		// ddepInput += '/'+req.params.ddepInput4;
		ddepInputArr.push(req.params.ddepInput4);
		ddepInputCount = 5;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		// ddepInput += '/'+req.params.ddepInput5;
		ddepInputArr.push(req.params.ddepInput5);
		ddepInputCount = 6;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		// ddepInput += '/'+req.params.ddepInput6;
		ddepInputArr.push(req.params.ddepInput6);
		ddepInputCount = 7;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		// ddepInput += '/'+req.params.ddepInput7;
		ddepInputArr.push(req.params.ddepInput7);
		ddepInputCount = 8;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		// ddepInput += '/'+req.params.ddepInput8;
		ddepInputArr.push(req.params.ddepInput8);
		ddepInputCount = 9;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		// ddepInput += '/'+req.params.ddepInput9;
		ddepInputArr.push(req.params.ddepInput9);
		ddepInputCount = 10;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var ddepInputPath = '';
	for (var i = 0; i < ddepInputArr.length; i++) {
		ddepInputPath += '/'+ddepInputArr[i];
	}

	var inpromise = new Promise(function(resolve, reject) {
		var inbound_options = {
			'method': 'POST',
			'url': inbound_url,
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
		}
		request(inbound_options, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var inbound_setting = JSON.parse(response.body);
			var project_id = '';
			var inbound_format = '';
			var outboundLastPath = '';
			if (inbound_setting.code != 0) {
				inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
				inbound_options = {
					'method': 'POST',
					'url': inbound_url,
					'headers': {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'ddepInput': ddepInput}),
				}
				request(inbound_options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					inbound_setting = JSON.parse(response.body);
					if (inbound_setting.code == 0) {
						var inbound_setting_data = inbound_setting.Data;
						var itemsArr = [];
						var inboundFormatArr = [];
						for (var i = 0; i < inbound_setting_data.length; i++) {
							itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
							inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
						}
						console.log("ITEMS_ARRAY => ");
						console.log(itemsArr);
						var newddepInputPath = ddepInput;
						var lastArrKey = 0;
						var ddepPath = '';
						for (var i = 0; i < ddepInputArr.length - 1; i++) {
							newddepInputPath += '/'+ddepInputArr[i];
							if (itemsArr[newddepInputPath] != undefined) {
								project_id = itemsArr[newddepInputPath];
								inbound_format = inboundFormatArr[newddepInputPath];
								lastArrKey = i;
								ddepPath = newddepInputPath;
							}
						}
						for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
							outboundLastPath += '/'+ddepInputArr[i];
						}
						console.log("DDEP_API_INPUT => " + ddepPath);
						console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
						resolve({
							code: "0",
							MsgCode: "10001",
							MsgType: "Get-Data-Success",
							MsgLang: "en",
							ShortMsg: "Get Success",
							LongMsg: "Found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							project_id : project_id,
							inbound_format : inbound_format,
							outboundLastPath : outboundLastPath
						});
					} else {
						return res.json({
							code: "1",
							MsgCode: "40001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Get Fail",
							LongMsg: "Not found Project with ddep api input",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "ShortMsg",
							Data: [],
						});
					}
				});
			} else {
				inbound_format = inbound_setting.Data.inbound_format;
				project_id = inbound_setting.Data.item_id;
				resolve({
					code: "0",
					MsgCode: "10001",
					MsgType: "Get-Data-Success",
					MsgLang: "en",
					ShortMsg: "Get Success",
					LongMsg: "Found Project with ddep api input",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "ShortMsg",
					project_id : project_id,
					inbound_format : inbound_format,
					outboundLastPath : outboundLastPath
				});
			}
		});
	});
	inpromise.then(function(result){
		if (result.code == 1) {
			return res.json({
				code: "1",
				MsgCode: "40001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Get Fail",
				LongMsg: "Not found Project with ddep api input",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "ShortMsg",
				Data: [],
			});
		} else {
			var project_id = result.project_id;
			var inbound_format = result.inbound_format;
			var outboundLastPath = result.outboundLastPath;
			console.log(project_id);
			console.log(inbound_format);
			console.log(outboundLastPath);
			var OutboundFormatData = {};
			var nodeDataArray = [];
			var linkDataArray = [];
			var outboundMappedData = {};
			var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
			request(mapping_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (Object.entries(reqBody).length > 0) {
					var inboundPostData = reqBody;
					if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
						inboundPostData = JSON.parse(reqBody);
					}
					console.log('Inbound posted Json:');
					console.log(inboundPostData);

					var mappingSetting = JSON.parse(body);
					if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
						OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
						var mapping_data = JSON.parse(mappingSetting.mapping_data);
						nodeDataArray = mapping_data.nodeDataArray;
						linkDataArray = mapping_data.linkDataArray;

						var linkdataarray = linkDataArray;
						var newLinkDataArr = [];
						var newLinkDataArrCount = [];
						for (var i = 0; i < linkdataarray.length; i++) {
							if (Object.entries(linkdataarray[i]).length > 0) {
								if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
									var linkdataarraykey = linkdataarray[i].to;
									var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
									if (linkdataarraykeycount > 1) {
										linkdataarraykey += linkdataarraykeycount;
									}
									newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
									newLinkDataArrCount.push(linkdataarraykey);
								}
							}
						}
						// console.log('newLinkDataArr:');
						// console.log(newLinkDataArr);

						if (newLinkDataArrCount.length > 0) {
							var mappingInboound = [];
							for (var key in newLinkDataArr) {
								var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
								mappingInboound[key] = inboundValue;
							}
							// console.log('mappingInboound:');
							// console.log(mappingInboound);

							var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
							console.log('Outbound format convert to replacement Format:');
							console.log(outboundFormatData);

							outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
							console.log('Outbound Final Result:');
							console.log(outboundMappedData);
							if (bodyreq != '' && outboundMappedData.length != 0) {
								bodyreq = outboundMappedData;
							}
							if (outboundMappedData.length != 0) {
								reqBody = outboundMappedData;
							}
						}
					}
				}

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					outboundSetting = JSON.parse(response.body);
					outbound_api_url = outboundSetting.api_url;

					if (outboundLastPath != '') {
						outbound_api_url += outboundLastPath;
					}

					var oldheaders = newHeader;
					delete oldheaders.Host;
					delete oldheaders['Accept-Encoding'];
					delete oldheaders.Connection;
					delete oldheaders['Content-Length'];

					var options = {
						'method': responseBody.method,
						'url': outbound_api_url+'?'+queryString,
						'headers': oldheaders,
					};
					if (bodyreq != '') {
						if(typereq != '' && typereq[1] == 'json') {
							options['body'] = JSON.stringify(bodyreq);
						} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
							options['body'] = JSON.stringify(bodyreq);
						} else {
							options['body'] = JSON.stringify(bodyreq);
						}
					} else {
						options['formData'] = JSON.parse(JSON.stringify(reqBody));
						if(Object.entries(options.formData).length == 0) {
							options.method = "GET";
						}
					}

					request(options, function (error, response, body) {
						if(error) {
							return res.json({
								code: "1",
								MsgCode: "50001",
								MsgType: "Invalid-Source",
								MsgLang: "en",
								ShortMsg: "Fail",
								LongMsg: error.message || "Some error occurred while getting.",
								InternalMsg: "",
								EnableAlert: "No",
								DisplayMsgBy: "LongMsg",
								Data: []
							});
						}
						if (response.statusCode == 200) {
							var contentType = response.headers['content-type'];
							var types = contentType.split(';');
							var type = types[0].split('/');
							if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
								return res.status(200).json(JSON.parse(body));
							} else {
								return res.send(body);
							}
						} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
							return res.send(response.body);
						} else {
							return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
						}
					});
				});
			});
		}
	});

	/*var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput+ddepInputPath}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inbound_setting = JSON.parse(response.body);
		var project_id = '';
		var inbound_format = '';
		var outboundLastPath = '';
		if (inbound_setting.code != 0) {
			inbound_url = config.domain + "/inbound_setting/ddepInputAPI/";
			inbound_options = {
				'method': 'POST',
				'url': inbound_url,
				'headers': {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'ddepInput': ddepInput}),
			}
			request(inbound_options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				inbound_setting = JSON.parse(response.body);
				if (inbound_setting.code == 0) {
					var inbound_setting_data = inbound_setting.Data;
					var itemsArr = [];
					var inboundFormatArr = [];
					for (var i = 0; i < inbound_setting_data.length; i++) {
						itemsArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].item_id;
						inboundFormatArr[inbound_setting_data[i].api_ddep_api] = inbound_setting_data[i].inbound_format;
					}
					console.log("ITEMS_ARRAY => ");
					console.log(itemsArr);
					var newddepInputPath = ddepInput;
					var lastArrKey = 0;
					var ddepPath = '';
					for (var i = 0; i < ddepInputArr.length - 1; i++) {
						newddepInputPath += '/'+ddepInputArr[i];
						if (itemsArr[newddepInputPath] != undefined) {
							project_id = itemsArr[newddepInputPath];
							inbound_format = inboundFormatArr[newddepInputPath];
							lastArrKey = i;
							ddepPath = newddepInputPath;
						}
					}
					for (var i = lastArrKey + 1; i < ddepInputArr.length; i++) {
						outboundLastPath += '/'+ddepInputArr[i];
					}
					console.log("DDEP_API_INPUT => " + ddepPath);
					console.log("OUTBOUND_API_END_PATH => " + outboundLastPath);
				} else {
					return res.status(404).json({
						code: "1",
						MsgCode: "40001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Get Fail",
						LongMsg: "Not found Project with ddep api input",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "ShortMsg",
						Data: [],
					});
				}
			});
		} else {
			inbound_format = inbound_setting.Data.inbound_format;
			project_id = inbound_setting.Data.item_id;
		}

		var OutboundFormatData = {};
		var nodeDataArray = [];
		var linkDataArray = [];
		var outboundMappedData = {};
		var mapping_url = config.domain + "/project/item/mapping/editAPI/" + project_id;
		request(mapping_url, function (error, response, body) {
			if(error) {
				return res.json({
					code: "1",
					MsgCode: "50001",
					MsgType: "Invalid-Source",
					MsgLang: "en",
					ShortMsg: "Fail",
					LongMsg: error.message || "Some error occurred while getting the inbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			if (Object.entries(reqBody).length > 0) {
				var inboundPostData = reqBody;
				if (typereq != '' && typereq[0] == 'text' && typereq[1] == 'plain') {
					inboundPostData = JSON.parse(reqBody);
				}
				console.log('Inbound posted Json:');
				console.log(inboundPostData);

				var mappingSetting = JSON.parse(body);
				if (mappingSetting.is_active == 'Active' && mappingSetting.outbound_format != '' && mappingSetting.mapping_data != '') {
					OutboundFormatData = JSON.parse(mappingSetting.outbound_format);
					var mapping_data = JSON.parse(mappingSetting.mapping_data);
					nodeDataArray = mapping_data.nodeDataArray;
					linkDataArray = mapping_data.linkDataArray;

					var linkdataarray = linkDataArray;
					var newLinkDataArr = [];
					var newLinkDataArrCount = [];
					for (var i = 0; i < linkdataarray.length; i++) {
						if (Object.entries(linkdataarray[i]).length > 0) {
							if (linkdataarray[i].category != undefined && linkdataarray[i].category == 'Mapping') {
								var linkdataarraykey = linkdataarray[i].to;
								var linkdataarraykeycount = checklinkdataarraykey(linkdataarraykey, newLinkDataArrCount);
								if (linkdataarraykeycount > 1) {
									linkdataarraykey += linkdataarraykeycount;
								}
								newLinkDataArr[linkdataarraykey] = linkdataarray[i].from;
								newLinkDataArrCount.push(linkdataarraykey);
							}
						}
					}
					// console.log('newLinkDataArr:');
					// console.log(newLinkDataArr);

					var mappingInboound = [];
					for (var key in newLinkDataArr) {
						var inboundValue = getInboundValue(inboundPostData, newLinkDataArr[key]);
						mappingInboound[key] = inboundValue;
					}
					// console.log('mappingInboound:');
					// console.log(mappingInboound);

					var outboundFormatData = outboundreplacementformatdata(OutboundFormatData, newLinkDataArr);
					console.log('Outbound format convert to replacement Format:');
					console.log(outboundFormatData);

					outboundMappedData = outboundformatdata(OutboundFormatData, mappingInboound);
					console.log('Outbound Final Result:');
					console.log(outboundMappedData);
					if (bodyreq != '' && outboundMappedData.length != 0) {
						bodyreq = outboundMappedData;
					}
					if (outboundMappedData.length != 0) {
						reqBody = outboundMappedData;
					}
				}
			}

			var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;
			request(outbound_url, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the inbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var outboundSetting = JSON.parse(body);
				var outbound_api_url = outboundSetting.api_url;

				if (outboundLastPath != '') {
					outbound_api_url += outboundLastPath;
				}

				var oldheaders = newHeader;
				delete oldheaders.Host;
				delete oldheaders['Accept-Encoding'];
				delete oldheaders.Connection;
				delete oldheaders['Content-Length'];

				var options = {
					'method': responseBody.method,
					'url': outbound_api_url+'?'+queryString,
					'headers': oldheaders,
				};
				if (bodyreq != '') {
					if(typereq != '' && typereq[1] == 'json') {
						options['body'] = JSON.stringify(bodyreq);
					} else if(typereq != '' && (typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml')) {
						options['body'] = JSON.stringify(bodyreq);
					} else {
						options['body'] = JSON.stringify(bodyreq);
					}
				} else {
					options['formData'] = JSON.parse(JSON.stringify(reqBody));
					if(Object.entries(options.formData).length == 0) {
						options.method = "GET";
					}
				}

				request(options, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					if (response.statusCode == 200) {
						var contentType = response.headers['content-type'];
						var types = contentType.split(';');
						var type = types[0].split('/');
						if ((type[0] == 'application' && type[1] == 'json') || type[1] == 'json') {
							return res.status(200).json(JSON.parse(body));
						} else {
							return res.send(body);
						}
					} else if(response.statusCode == 301 || response.statusCode == 302 || response.statusCode == 303) {
						return res.send(response.body);
					} else {
						return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
					}
				});
			});
		});
	});*/
});

router.post('/mapping/convert/json2JSD', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	// var schema = toJsonSchema(reqBody);

	var schema = jsonSchemaGenerator(reqBody);

	return res.status(200).send(schema);
});

router.post('/mapping/convert/xml2JSD', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);
	var xmljson;
	parseString(reqBody, function (err, result) {
		console.dir(result);
		xmljson = result;
	});
	console.log(xmljson);

	// var schema = toJsonSchema(xmljson);

	var schema = jsonSchemaGenerator(xmljson);

	return res.status(200).send(schema);
});

router.post('/mapping/convert/JSD2GOJSD', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var mainObject = {};
	if (whatIsIt(reqBody) == 'Object') {
		mainObject = object_for_each(reqBody);
	}

	var keys = make_inbound_keys(mainObject);

	console.log('keyArray');
	console.log(keyArray);
	var gojsd = {};
	gojsd['schema'] = mainObject;
	gojsd['keys'] = keyArray;
	console.log(gojsd);

	return res.status(200).send(gojsd);
});

var mainKey = [];
var keyArray = [];
router.post('/mapping/convert/json2GOJSD', function(req, res) {
	var reqBody = req.body;
	mainKey = [];
	keyArray = [];

	console.log(reqBody);

	// var schema = toJsonSchema(reqBody);

	var schema = jsonSchemaGenerator(reqBody);

	console.log(JSON.stringify(schema));

	var mainObject = {};
	if (whatIsIt(schema) == 'Object') {
		mainObject = object_for_each(schema);
	}

	var keys = make_inbound_keys(mainObject);

	console.log('keyArray');
	console.log(keyArray);
	var gojsd = {};
	gojsd['schema'] = mainObject;
	gojsd['keys'] = keyArray;
	console.log(gojsd);

	return res.status(200).send(gojsd);
});

router.post('/mapping/convert/injson2GOJSD', function(req, res) {
	var reqBody = req.body;
	mainKey = [];
	keyArray = [];

	console.log(reqBody);

	// var schema = toJsonSchema(reqBody);

	var schema = jsonSchemaGenerator(reqBody);

	console.log(JSON.stringify(schema));

	var mainObject = {};
	if (whatIsIt(schema) == 'Object') {
		mainObject = object_for_each(schema);
	}

	var keys = make_inbound_keys(mainObject);

	console.log('keyArray');
	console.log(keyArray);
	var gojsd = {};
	gojsd['schema'] = mainObject;
	gojsd['keys'] = keyArray;
	console.log(gojsd);

	return res.status(200).send(gojsd);
});

router.post('/mapping/convert/outjson2GOJSD', function(req, res) {
	var reqBody = req.body;
	mainKey = [];
	keyArray = [];

	console.log(reqBody);

	// var schema = toJsonSchema(reqBody);

	var schema = jsonSchemaGenerator(reqBody);

	console.log(JSON.stringify(schema));

	var mainObject = {};
	if (whatIsIt(schema) == 'Object') {
		mainObject = object_for_each(schema);
	}

	var keys = make_outbound_keys(mainObject);

	console.log('keyArray');
	console.log(keyArray);
	var gojsd = {};
	gojsd['schema'] = mainObject;
	gojsd['keys'] = keyArray;
	console.log(gojsd);

	return res.status(200).send(gojsd);
});

router.post('/mapping/convert/xml2GOJSD', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var xmljson;
	parseString(reqBody, function (err, result) {
		console.dir(result);
		xmljson = result;
	});

	// var schema = toJsonSchema(xmljson);

	var schema = jsonSchemaGenerator(xmljson);

	console.log(JSON.stringify(schema));

	var mainObject = {};
	if (whatIsIt(schema) == 'Object') {
		mainObject = object_for_each(schema);
	}

	var keys = make_inbound_keys(mainObject);

	console.log('keyArray');
	console.log(keyArray);
	var gojsd = {};
	gojsd['schema'] = mainObject;
	gojsd['keys'] = keyArray;
	console.log(gojsd);

	return res.status(200).send(gojsd);
});

router.post('/mapping/convert/JSD2json', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var mainObject = {};
	if (whatIsIt(reqBody) == 'Object') {
		mainObject = object_for_each(reqBody);
	}

	var newMainObject = {};
	console.log('JSD2json');
	if (Object.entries(mainObject).length !== 0) {
		console.log(Object.entries(mainObject).length);
		newMainObject = json_schema_to_json(mainObject);
	}
	console.log(newMainObject);

	return res.status(200).send(newMainObject);
});

/*router.post('/mapping/convert/JSD2xml', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var mainObject = {};
	if (whatIsIt(reqBody) == 'Object') {
		mainObject = object_for_each(reqBody);
	}

	var newMainObject = {};
	console.log('JSD2xml');
	if (Object.entries(mainObject).length !== 0) {
		console.log(Object.entries(mainObject).length);
		newMainObject = json_schema_to_json(mainObject);
	}
	console.log(newMainObject);

	var builder = new xml2js.Builder();
	var xml = builder.buildObject(newMainObject);
	console.log(xml);

	return res.status(200).send(xml);
});

router.post('/mapping/convert/GOJSD2json', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var mainObject = reqBody;

	var newMainObject = {};
	console.log('GOJSD2json');
	if (Object.entries(mainObject).length !== 0) {
		console.log(Object.entries(mainObject).length);
		newMainObject = json_schema_to_json(mainObject);
	}
	console.log(newMainObject);

	return res.status(200).send(newMainObject);
});

router.post('/mapping/convert/GOJSD2xml', function(req, res) {
	var reqBody = req.body;

	console.log(reqBody);

	var mainObject = reqBody;

	var newMainObject = {};
	console.log('GOJSD2xml');
	if (Object.entries(mainObject).length !== 0) {
		console.log(Object.entries(mainObject).length);
		newMainObject = json_schema_to_json(mainObject);
	}
	console.log(newMainObject);

	var builder = new xml2js.Builder();
	var xml = builder.buildObject(newMainObject);
	console.log(xml);

	return res.status(200).send(xml);
});*/

function object_for_each(data) {
	var mainObject = {};
	var secondObject = {};
	var i = 0;
	var j = 0;
	Object.entries(data).forEach(([key, value]) => {
		if (key != 'format') {
			var getvalue = object_for_each1(key, value);
			console.log(getvalue);
			if (whatIsIt(getvalue) == 'Object') {
				if (Object.entries(getvalue).length !== 0) {
					if (whatIsIt(getvalue) == 'Object') {
						secondObject = getvalue;
					} else {
						secondObject[i] = getvalue;
						i += 1;
					}
				}
			} else if (whatIsIt(getvalue) != 'Object' && whatIsIt(getvalue) != 'Array') {
				mainObject = getvalue;
			}
		}
	});

	console.log('mainObject');
	console.log(mainObject);
	console.log('secondObject');
	console.log(secondObject);
	var merged = {};
	Object.entries(secondObject).forEach(([key, value]) => {
		var newObject = {};
		newObject[key] = value;
		merged = Object.assign(mainObject, mainObject, newObject);
	});

	if (Object.entries(merged).length === 0) {
		merged = mainObject;
	}

	console.log('merged');
	console.log(merged);
	return merged;
}

var checkArr = 0;
function object_for_each1(key, value) {
	console.log('j 123 '+key);
	var mainObject = {};
	if (key == 'format' || key == '$schema' || key == 'minLength' || key == 'minItems' || key == 'uniqueItems') {
		console.log(key);
		return mainObject;
	}
	var secondObject = {};
	var i = 0;
	var j = 0;
	var isarray = 0;
	if (whatIsIt(value) == 'Object') {
		console.log('j '+j);
		j += 1;
		var firstObject = object_for_each2(value);
		console.log('firstObject');
		console.log(firstObject);
		if (key == 'type') {
			return mainObject = firstObject;
		} else if (key == 'properties') {
			if (whatIsIt(firstObject) == 'Object') {
				secondObject = firstObject;
			} else {
				secondObject[i] = firstObject;
				i += 1;
			}
		} else if (key != 'properties') {
			if (checkArr == 0 || key != 'items') {
				console.log('first object type check');
				console.log(whatIsIt(firstObject));
				if (whatIsIt(firstObject) == 'Object') {
					var mainObjectTest = {};
					Object.entries(firstObject).forEach(([key1, value1]) => {
						console.log(whatIsIt(value1));
						console.log(value1);
						console.log(key);
						var mT = {};
						if (whatIsIt(value1) == 'Array') {
							var newArr1 = [];
							newArr1.push(value1);
							mT = Object.assign(mainObjectTest, mainObjectTest, newArr1);
						} else {
							mT = Object.assign(mainObjectTest, mainObjectTest, firstObject);
						}
					});
					console.log('mainObjectTest');
					console.log(mainObjectTest);
					console.log(mainObjectTest[0]);
					console.log(Object.entries(mainObjectTest).length);
					if (mainObjectTest[0] != undefined && Object.entries(mainObjectTest).length === 1) {
						mainObject[key] = mainObjectTest[0];
					} else {
						delete mainObjectTest[0];
						mainObject[key] = mainObjectTest;
					}
					console.log('mainObjectTest end');
				} else {
					mainObject[key] = firstObject;
				}
			} else {
				var newArr = [];
				console.log('push in array');
				console.log(firstObject);
				if (Object.entries(firstObject).length === 0) {
					firstObject = "string";
				}
				newArr.push(firstObject);
				console.log(whatIsIt(firstObject));
				mainObject[key] = newArr;
				checkArr -= 1;
			}
		}
	} else if (whatIsIt(value) != 'Object' && whatIsIt(value) != 'Array') {
		if (value != 'array' && value != 'object') {
			if (key == 'type' ) {
				return mainObject = value;
			} else if (key == 'properties') {
				if (whatIsIt(value) == 'Object') {
					secondObject = value;
				} else {
					secondObject[i] = value;
					i += 1;
				}
			} else if (key != 'properties') {
				if (checkArr == 0 || key != 'items') {
					mainObject[key] = value;
				} else {
					var newArr = [];
					console.log('push in array 1');
					console.log(value);
					newArr.push(value);
					mainObject[key] = newArr;
					checkArr -= 1;
				}
			}
		} else if (value == 'array') {
			console.log('checkArr');
			console.log(value);
			checkArr += 1;
		}
	}

	console.log('mainObject1');
	console.log(mainObject);
	console.log('secondObject1');
	console.log(secondObject);
	var merged = {};
	Object.entries(secondObject).forEach(([key, value]) => {
		var newtest = {};
		newtest[key] = value;
		merged = Object.assign(mainObject, mainObject, newtest);
	});

	if (Object.entries(merged).length === 0) {
		merged = mainObject;
	}

	console.log('mainObject1');
	console.log(mainObject);
	console.log('merged1');
	console.log(merged);
	return merged;
}

function object_for_each2(data) {
	console.log('i 123');
	console.log(data);
	var mainObject = {};
	var secondObject = {};
	var merged1 = {};
	var i = 0;
	var j = 0;
	Object.entries(data).forEach(([key, value]) => {
		console.log('key '+key+' value '+value);
		var getvalue = object_for_each1(key, value);
		console.log('getvalue');
		console.log(getvalue);
		console.log(Object.entries(getvalue).length);
		if (whatIsIt(getvalue) == 'Object') {
			if (Object.entries(getvalue).length !== 0) {
				console.log('getvalue1');
				console.log(getvalue);
				if (whatIsIt(getvalue) == 'Object') {
					// secondObject = getvalue;
					merged1 = Object.assign(secondObject, secondObject, getvalue);
					console.log('merged3');
					console.log(merged1);
				} else {
					secondObject[i] = getvalue;
					i += 1;
				}
				if (key == 'format') {
					console.log(key);
					return false;
				}
			}
		} else if (whatIsIt(getvalue) != 'Object' && whatIsIt(getvalue) != 'Array') {
			console.log('getvalue2');
			console.log(getvalue);
			mainObject = getvalue;
			if (key == 'format') {
				console.log(key);
				return false;
			}
		}
	});

	console.log('mainObject2');
	console.log(mainObject);
	console.log('secondObject2');
	console.log(secondObject);
	var merged = {};
	Object.entries(secondObject).forEach(([key, value]) => {
		merged = Object.assign({}, mainObject, secondObject);
	});

	if (Object.entries(merged).length === 0) {
		merged = mainObject;
	}
	console.log('merged2');
	console.log(merged);

	return merged;
}

function make_inbound_keys(data) {
	var mainObject = {};
	Object.entries(data).forEach(([key, value]) => {
		var getvalue = get_inbound_key_obj(key, value);
	});
	return mainObject;
}

function get_inbound_key_obj(key, value) {
	var mainObject = {};
	if (whatIsIt(value) == 'Object') {
		if (mainKey.length == 0) {
			var newKey = '@In{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 1');
				console.log(mainKey[i]);
				if (mainKey[i] == 0) {
					console.log('0 value remove mainKey[i] 1');
				} else {
					console.log('value add mainKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@In{'+key+'}';
				} else {
					var newKey = '@In{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
		mainKey.push(key);
		var newKey = make_inbound_keys(value);
		mainKey = [];
	} else if (whatIsIt(value) == 'Array') {
		if (mainKey.length == 0) {
			var newKey = '@In{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 2');
				console.log(mainKey[i]);
				if (mainKey[i] == 0) {
					console.log('0 value remove mainKey[i] 2');
				} else {
					console.log('value add mainKey[i] 2');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@In{'+key+'}';
				} else {
					var newKey = '@In{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
		if (key >= 0) {
		} else {
			mainKey.push(key);
		}
		var newKey = make_inbound_keys(value);
		mainKey = [];
	} else if (whatIsIt(value) != 'Object' && whatIsIt(value) != 'Array') {
		var keyObj = {};
		if (mainKey.length == 0) {
			var newKey = '@In{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 3');
				console.log(mainKey[i]);
				if (mainKey[i] == 0 || mainKey[i] == '0') {
					console.log('0 value remove mainKey[i] 3');
				} else {
					console.log('value add mainKey[i] 3');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@In{'+key+'}';
				} else {
					var newKey = '@In{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
	}
	return mainObject;
}

function make_outbound_keys(data) {
	var mainObject = {};
	Object.entries(data).forEach(([key, value]) => {
		var getvalue = get_outbound_key_obj(key, value);
	});
	return mainObject;
}

function get_outbound_key_obj(key, value) {
	var mainObject = {};
	if (whatIsIt(value) == 'Object') {
		if (mainKey.length == 0) {
			var newKey = '@Out{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 1');
				console.log(mainKey[i]);
				if (mainKey[i] == 0) {
					console.log('0 value remove mainKey[i] 1');
				} else {
					console.log('value add mainKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@Out{'+key+'}';
				} else {
					var newKey = '@Out{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
		mainKey.push(key);
		var newKey = make_outbound_keys(value);
		mainKey = [];
	} else if (whatIsIt(value) == 'Array') {
		if (mainKey.length == 0) {
			var newKey = '@Out{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 2');
				console.log(mainKey[i]);
				if (mainKey[i] == 0) {
					console.log('0 value remove mainKey[i] 2');
				} else {
					console.log('value add mainKey[i] 2');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@Out{'+key+'}';
				} else {
					var newKey = '@Out{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
		if (key >= 0) {
		} else {
			mainKey.push(key);
		}
		var newKey = make_outbound_keys(value);
		mainKey = [];
	} else if (whatIsIt(value) != 'Object' && whatIsIt(value) != 'Array') {
		var keyObj = {};
		if (mainKey.length == 0) {
			var newKey = '@Out{'+key+'}';
			keyObj = { key : newKey };
			keyArray.push(keyObj);
		} else {
			var firstKey = '';
			for (var i = 0; i < mainKey.length; i++) {
				console.log('mainKey[i] 3');
				console.log(mainKey[i]);
				if (mainKey[i] == 0 || mainKey[i] == '0') {
					console.log('0 value remove mainKey[i] 3');
				} else {
					console.log('value add mainKey[i] 3');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + mainKey[i];
				}
			}
			if (key >= 0) {} else {
				if (firstKey == '') {
					var newKey = '@Out{'+key+'}';
				} else {
					var newKey = '@Out{'+firstKey+'.'+key+'}';
				}
				console.log('value add mainKey[i] 1 => '+newKey);
				keyObj = { key : newKey };
				keyArray.push(keyObj);
			}
		}
	}
	return mainObject;
}

function json_schema_to_json(data) {
	var newMainObject = {};
	Object.entries(data).forEach(([key, value]) => {
		console.log('key ' + key + ' value '+ value);
		console.log(value);
		console.log(whatIsIt(value));
		newMainObject[key] = set_json_value(value);
	});
	return newMainObject;
}

function set_json_value(value) {
	console.log(value);
	console.log(whatIsIt(value));
	if (whatIsIt(value) == 'Object') {
		return json_schema_to_json(value);
	} else if (whatIsIt(value) == 'Array') {
		var valArr = [];
		console.log('array length '+value.length);
		for (var i = 0; i < value.length; i++) {
			if (whatIsIt(value[i]) == 'Object') {
				valArr.push(json_schema_to_json(value[i]));
			} else {
				valArr.push(get_value_for_key(value[i]));
			}
		}
		return valArr;
	} else if (whatIsIt(value) == 'String') {
		return get_value_for_key(value);
	}
	return '';
}

function get_value_for_key(value) {
	if (value == 'string') {
		return 'abcd';
	} else if (value == 'integer') {
		return 123;
	} else if (value == 'number') {
		return 12.30;
	}
	return 'dcba';
}

function whatIsIt(object) {
	if (object === null) {
	    return "null";
	} else if (object === undefined) {
	    return "undefined";
	} else if (object.constructor === stringConstructor) {
	    return "String";
	} else if (object.constructor === arrayConstructor) {
	    return "Array";
	} else if (object.constructor === objectConstructor) {
        return "Object";
    } else if (object.constructor === integerConstructor) {
    	return "Integer";
    } else {
        return "Unknown";
    }
}

function ddep_api(reqBody, ddepInput, res) {
	var inbound_url = config.domain+"/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}

	request(inbound_options, function (error, response, body) {
		if(error) {
			return res.json({
				code: "1",
				MsgCode: "50001",
				MsgType: "Invalid-Source",
				MsgLang: "en",
				ShortMsg: "Fail",
				LongMsg: error.message || "Some error occurred while getting the inbound setting.",
				InternalMsg: "",
				EnableAlert: "No",
				DisplayMsgBy: "LongMsg",
				Data: []
			});
		}
		var inboundSetting = JSON.parse(body);

		if (inboundSetting.code == 0) {
			var project_id = inboundSetting.Data.project_id;
			var project_url = config.domain + "/projects/editAPI/" + project_id;
			request(project_url, function (error, response, pbody) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting the outbound setting.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var projectSetting = JSON.parse(pbody);
				if (projectSetting.isActive != "1") {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: "Project is not active..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				if (inboundSetting.Data.is_active != "Active") {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: "Project inbound setting is not active.",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				var inbound_format = inboundSetting.Data.inbound_format;

				var outbound_url = config.domain + "/outbound_setting/editAPI/" + project_id;

				request(outbound_url, function (error, response, body) {
					if(error) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: error.message || "Some error occurred while getting the inbound setting.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					var outboundSetting = JSON.parse(body);
					if (outboundSetting.is_active != "Active") {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: "Project outbound setting is not active.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
					var outbound_api_url = outboundSetting.api_url
					try {
						if (inbound_format == "json") {
							var result = JSON.parse(JSON.stringify(reqBody));
							var out_data = result;
						} else {
							var result = JSON.parse(JSON.stringify(reqBody));
							var out_data = result;
						}
						if(out_data.length !== 0) {
							var outbound_api_options = {
								'method': 'POST',
								'url': outbound_api_url,
								'headers': {
									'Content-Type': 'text/plain'
								},
								formData:{
									'TuuJson':JSON.stringify(out_data)
								},
							}
							request(outbound_api_options, function (error, response) {
								if (error) {
									return res.json({
										code: "1",
										MsgCode: "50001",
										MsgType: "Invalid-Source",
										MsgLang: "en",
										ShortMsg: "Fail",
										LongMsg: error.message || "Some error occurred while run the outbound.",
										InternalMsg: "",
										EnableAlert: "No",
										DisplayMsgBy: "LongMsg",
										Data: []
									});
								}
								try {
									dataoutboundres = JSON.parse(response.body);
									if(dataoutboundres.SaveType == "Success") {
										return res.status(200).send({
											code: "0",
											MsgCode: "10001",
											MsgType: "Data-Success",
											MsgLang: "en",
											ShortMsg: "Successful",
											LongMsg: "The data send successful",
											InternalMsg: "",
											EnableAlert: "No",
											DisplayMsgBy: "ShortMsg",
											Data: []
										});
									} else {
										return res.status(500).send({
											code: "1",
											MsgCode: "50001",
											MsgType: "Exception-Error",
											MsgLang: "en",
											ShortMsg: "Data Send Fail",
											LongMsg: dataoutboundres.Msg || "Some error occurred while outbound post the data.",
											InternalMsg: "",
											EnableAlert: "No",
											DisplayMsgBy: "LongMsg",
											Data: []
										});
									}
								} catch(e) {
									return res.json({
										code: "1",
										MsgCode: "50001",
										MsgType: "Invalid-Source",
										MsgLang: "en",
										ShortMsg: "Fail",
										LongMsg: e.message || "Some error occurred while run the outbound.",
										InternalMsg: "",
										EnableAlert: "No",
										DisplayMsgBy: "LongMsg",
										Data: []
									});
								}
							});
						}
					} catch(err) {
						return res.json({
							code: "1",
							MsgCode: "50001",
							MsgType: "Invalid-Source",
							MsgLang: "en",
							ShortMsg: "Fail",
							LongMsg: err.message || "Some error occurred while post data in the outbound api.",
							InternalMsg: "",
							EnableAlert: "No",
							DisplayMsgBy: "LongMsg",
							Data: []
						});
					}
				});
			});
		} else {
			return res.json(inboundSetting);
		}
	});
}

var parentKey = [];
var inboundDataArray = [];
function getInboundValue(inboundPostData, inboundkey) {
	parentKey = [];
	inboundDataArray = [];
	return returnValue = getInboundValueEach(inboundPostData, inboundkey);
}

function getInboundValueEach(inboundPostData, inboundkey) {
	var returnValue = '';
	// console.log("inboundkey => "+inboundkey);
	Object.entries(inboundPostData).forEach((entry) => {
		const [key, value] = entry;
		// console.log("key => "+key);

		var newKey = '@In{'+key+'}';
		var firstKey = '';
		if (parentKey.length != 0) {
			for (var i = 0; i < parentKey.length; i++) {
				// console.log('parentKey[i] 1');
				// console.log(parentKey[i]);
				if (parentKey[i] == 0) {
					// console.log('0 value remove parentKey[i] 1');
				} else {
					// console.log('value add parentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + parentKey[i];
				}
			}
		}
		if (firstKey == '') {
			newKey = '@In{'+key+'}';
			// console.log('newKey 1 => '+ newKey);
		} else {
			newKey = '@In{'+firstKey+'.'+key+'}';
			// console.log('newKey 2 => '+ newKey);
		}
		if (inboundkey == newKey) {
			returnValue = value;
		}
		var key_count = checkKey(newKey, inboundDataArray);
		if (key_count > 1) {
			if (firstKey == '') {
				newKey = '@In{'+key+key_count+'}';
				// console.log('newKey 3 => '+ newKey);
			} else {
				newKey = '@In{'+firstKey+'.'+key+key_count+'}';
				// console.log('newKey 4 => '+ newKey);
			}
			if (inboundkey == newKey) {
				returnValue = value;
			}
		}

		if (returnValue == '') {
			if (!Array.isArray(value) && value != null && typeof(value) != "object") {
				inboundDataArray.push({ key: newKey, value: value });
			}
			if (!Array.isArray(value) && value != null && typeof(value) == "object") {
				parentKey.push(key);
				returnValue = getInboundValueEach1(value, inboundkey);
				parentKey = [];
			}
			if (Array.isArray(value) && value != null && typeof(value) == "object") {
				parentKey.push(key);
				returnValue = getInboundValueEach1(value, inboundkey);
				parentKey = [];
			}
		}
	});
	return returnValue;
}

function getInboundValueEach1(value, inboundkey) {
	return returnValue = getInboundValueEach(value, inboundkey);
}

function checkKey(key, dataArray) {
	j = 1;
	for (var i = 0; i < dataArray.length; i++) {
		var key1 = (j == 1) ? key : key + j;
		if (dataArray[i]['key'] == key1) {
			j++;
		}
	}
	return j;
}

function checklinkdataarraykey(key, dataArray) {
	j = 1;
	for (var i = 0; i < dataArray.length; i++) {
		var key1 = (j == 1) ? key : key + j;
		if (dataArray[i] == key1) {
			j++;
		}
	}
	return j;
}

var outboundReplacementFormatDataParentKey = [];
function outboundreplacementformatdata(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundReplacementFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundReplacementFormatDataParentKey.length; i++) {
				// console.log('outboundReplacementFormatDataParentKey[i] 1');
				// console.log(outboundReplacementFormatDataParentKey[i]);
				if (outboundReplacementFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundReplacementFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundReplacementFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundReplacementFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+firstKey+'.'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = objval; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = '';
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		}
	});
	return outboundFormatData;
}

function outboundreplacementformatdata1(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundReplacementFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundReplacementFormatDataParentKey.length; i++) {
				// console.log('outboundReplacementFormatDataParentKey[i] 1');
				// console.log(outboundReplacementFormatDataParentKey[i]);
				if (outboundReplacementFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundReplacementFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundReplacementFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundReplacementFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+firstKey+'.'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = objval; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = '';
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		}
	});
	return outboundFormatData;
}

function outboundreplacementformatdata2(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundReplacementFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundReplacementFormatDataParentKey.length; i++) {
				// console.log('outboundReplacementFormatDataParentKey[i] 1');
				// console.log(outboundReplacementFormatDataParentKey[i]);
				if (outboundReplacementFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundReplacementFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundReplacementFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundReplacementFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var secondObject = merged = {};
				if (key >= 0) { outboundFormatData = dataArr['@Out{'+firstKey+'.'+key+'}']; } else {
					secondObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundReplacementFormatDataParentKey.push(key);
				objval = outboundreplacementformatdata1(value, dataArr);
				outboundReplacementFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;

					var secondObject = merged = {};
					secondObject[subkey] = dataArr['@Out{'+key+'.'+subkey+'}'];

					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = objval; } else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else if (firstKey != '' && dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			} else {
				var firstObject = merged1 = {};
				if (key >= 0) { outboundFormatData = ''; } else {
					firstObject[key] = '';
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		}
	});
	return outboundFormatData;
}

var outboundFormatDataParentKey = [];
function outboundformatdata(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundFormatDataParentKey.length; i++) {
				// console.log('outboundFormatDataParentKey[i] 1');
				// console.log(outboundFormatDataParentKey[i]);
				if (outboundFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundFormatDataParentKey.push(key);
				objval = outboundformatdata1(value, dataArr);
				outboundFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;
					var outType = typeof(subvalue);
					// console.log("outbound subkey 2 => "+subkey);
					// console.log("outType 2 => "+outType);
					if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
						var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
						// console.log("inType 2 => "+inType);
						if (inType == 'object' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'array' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'integer' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'integer' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'number' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'number' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'boolean' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'boolean' && outType == 'number') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else if (inType == 'boolean' && outType == 'integer') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
						}
					} else {
						var dataValuestrnumbool = '';
					}
					var secondObject = merged = {};
					secondObject[subkey] = dataValuestrnumbool;
					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) {
					outboundFormatData = objval;
				} else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 1 => "+key);
				// console.log("outType 1 => array");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 1 => "+inType);
				var dataValuestrnumbool = [];

				if (inType == 'object') {
					dataValuestrnumbool.push(dataArr['@Out{'+key+'}']);
				} else if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var newObject = {};
					newObject[key] = dataArr['@Out{'+key+'}'];
					dataValuestrnumbool.push(newObject);
				} else {
					dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+firstKey+'.'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundFormatDataParentKey.push(key);
				objval = outboundformatdata1(value, dataArr);
				outboundFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;
					var outType = typeof(subvalue);
					// console.log("outbound subkey 1 => "+subkey);
					// console.log("outType 1 => "+outType);
					if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
						var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
						// console.log("inType 1 => "+inType);
						if (inType == 'object' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'array' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'integer' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'integer' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'number' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'number' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'boolean' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'boolean' && outType == 'number') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else if (inType == 'boolean' && outType == 'integer') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
						}
					} else {
						var dataValuestrnumbool = '';
					}
					var secondObject = merged = {};
					secondObject[subkey] = dataValuestrnumbool;;
					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) {
					outboundFormatData = objval;
				} else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
			var outType = typeof(value);
			// console.log("outbound key => "+key);
			// console.log("outType => "+outType);
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+firstKey+'.'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
			} else {
				var dataValuestrnumbool = '';
			}
			var firstObject = merged1 = {};
			if (key >= 0) {
				outboundFormatData = dataValuestrnumbool;
			} else {
				firstObject[key] = dataValuestrnumbool;
				merged1 = Object.assign(outboundFormatData, firstObject);
			}
		}
	});
	return outboundFormatData;
}

function outboundformatdata1(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundFormatDataParentKey.length; i++) {
				// console.log('outboundFormatDataParentKey[i] 1');
				// console.log(outboundFormatDataParentKey[i]);
				if (outboundFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundFormatDataParentKey.push(key);
				objval = outboundformatdata2(value, dataArr);
				outboundFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;
					var outType = typeof(subvalue);
					// console.log("outbound subkey 2 => "+subkey);
					// console.log("outType 2 => "+outType);
					if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
						var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
						// console.log("inType 2 => "+inType);
						if (inType == 'object' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'array' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'integer' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'integer' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'number' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'number' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'boolean' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'boolean' && outType == 'number') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else if (inType == 'boolean' && outType == 'integer') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
						}
					} else {
						var dataValuestrnumbool = '';
					}
					var secondObject = merged = {};
					secondObject[subkey] = dataValuestrnumbool;
					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) {
					outboundFormatData = objval;
				} else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 1 => "+key);
				// console.log("outType 1 => array");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 1 => "+inType);
				var dataValuestrnumbool = [];

				if (inType == 'object') {
					dataValuestrnumbool.push(dataArr['@Out{'+key+'}']);
				} else if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var newObject = {};
					newObject[key] = dataArr['@Out{'+key+'}'];
					dataValuestrnumbool.push(newObject);
				} else {
					dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+firstKey+'.'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundFormatDataParentKey.push(key);
				console.log('test key 1 => '+key);
				objval = outboundformatdata2(value, dataArr);
				outboundFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;
					var outType = typeof(subvalue);
					// console.log("outbound subkey 1 => "+subkey);
					// console.log("outType 1 => "+outType);
					if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
						var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
						// console.log("inType 1 => "+inType);
						if (inType == 'object' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'array' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'integer' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'integer' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'number' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'number' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'boolean' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'boolean' && outType == 'number') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else if (inType == 'boolean' && outType == 'integer') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
						}
					} else {
						var dataValuestrnumbool = '';
					}
					var secondObject = merged = {};
					secondObject[subkey] = dataValuestrnumbool;;
					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) {
					outboundFormatData = objval;
				} else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
				console.log('test key 5 => '+key);
			var outType = typeof(value);
			// console.log("outbound key => "+key);
			// console.log("outType => "+outType);
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+firstKey+'.'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
			} else {
				var dataValuestrnumbool = '';
			}
			var firstObject = merged1 = {};
			if (key >= 0) {
				outboundFormatData = dataValuestrnumbool;
			} else {
				firstObject[key] = dataValuestrnumbool;
				merged1 = Object.assign(outboundFormatData, firstObject);
			}
		}
	});
	return outboundFormatData;
}

function outboundformatdata2(OutboundData, dataArr) {
	var outboundFormatData = {};

	Object.entries(OutboundData).forEach((entry) => {
		var [key, value] = entry;

		var firstKey = '';
		if (outboundFormatDataParentKey.length != 0) {
			for (var i = 0; i < outboundFormatDataParentKey.length; i++) {
				// console.log('outboundFormatDataParentKey[i] 1');
				// console.log(outboundFormatDataParentKey[i]);
				if (outboundFormatDataParentKey[i] == 0) {
					// console.log('0 value remove outboundFormatDataParentKey[i] 1');
				} else {
					// console.log('value add outboundFormatDataParentKey[i] 1');
					if (firstKey != '') {
						firstKey = firstKey + '.';
					}
					firstKey = firstKey + outboundFormatDataParentKey[i];
				}
			}
		}
		if (!Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				if (value.length != undefined && value.length > 0) {
					var objval = {};
					outboundFormatDataParentKey.push(key);
					objval = outboundformatdata1(value, dataArr);
					outboundFormatDataParentKey = [];
					/*Object.entries(value).forEach((itementry) => {
						var [subkey, subvalue] = itementry;
						var outType = typeof(subvalue);
						// console.log("outbound subkey 2 => "+subkey);
						// console.log("outType 2 => "+outType);
						if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
							var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
							// console.log("inType 2 => "+inType);
							if (inType == 'object' && outType == 'string') {
								var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
							} else if (inType == 'array' && outType == 'string') {
								var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
							} else if (inType == 'integer' && outType == 'string') {
								var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
							} else if (inType == 'integer' && outType == 'boolean') {
								if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
									var dataValuestrnumbool = false;
								} else {
									var dataValuestrnumbool = true;
								}
							} else if (inType == 'number' && outType == 'string') {
								var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
							} else if (inType == 'number' && outType == 'boolean') {
								if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
									var dataValuestrnumbool = false;
								} else {
									var dataValuestrnumbool = true;
								}
							} else if (inType == 'boolean' && outType == 'string') {
								var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
							} else if (inType == 'boolean' && outType == 'number') {
								if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
									var dataValuestrnumbool = 0;
								} else {
									var dataValuestrnumbool = 1;
								}
							} else if (inType == 'boolean' && outType == 'integer') {
								if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
									var dataValuestrnumbool = 0;
								} else {
									var dataValuestrnumbool = 1;
								}
							} else {
								var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
							}
						} else {
							var dataValuestrnumbool = '';
						}
						var secondObject = merged = {};
						secondObject[subkey] = dataValuestrnumbool;
						merged = Object.assign(objval, secondObject, secondObject);
					});*/
					var firstObject = merged1 = {};
					if (key >= 0) {
						outboundFormatData = objval;
					} else {
						firstObject[key] = objval;
						merged1 = Object.assign(outboundFormatData, firstObject);
					}
				} else {
					outboundFormatData = '';
				}
			}
		} else if (Array.isArray(value) && value != null && typeof(value) == "object") {
			if (dataArr['@Out{'+key+'}'] != undefined) {
				// console.log("outbound key 1 => "+key);
				// console.log("outType 1 => array");
				var isArray = Array.isArray(dataArr['@Out{'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+key+'}']));
				// console.log("inType 1 => "+inType);
				var dataValuestrnumbool = [];

				if (inType == 'object') {
					dataValuestrnumbool.push(dataArr['@Out{'+key+'}']);
				} else if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var newObject = {};
					newObject[key] = dataArr['@Out{'+key+'}'];
					dataValuestrnumbool.push(newObject);
				} else {
					dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				// console.log("outbound key 2 => "+key);
				// console.log("outType 2 => object");
				var isArray = Array.isArray(dataArr['@Out{'+firstKey+'.'+key+'}']);
				var inType = (isArray ? 'array' : typeof(dataArr['@Out{'+firstKey+'.'+key+'}']));
				// console.log("inType 2 => "+inType);
				if (inType == 'string' || inType == 'integer' || inType == 'number' || inType == 'boolean') {
					var dataValuestrnumbool = {};
					dataValuestrnumbool[key] = dataArr['@Out{'+firstKey+'.'+key+'}'];
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
				for (var i = 2; i < 26; i++) {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'+i] != undefined) {
						if (typeof(dataArr['@Out{'+firstKey+'.'+key+'}'+i]) == 'object') {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						} else {
							dataValuestrnumbool.push(dataArr['@Out{'+firstKey+'.'+key+'}'+i]);
						}
					}
				}

				var secondObject = merged = {};
				if (key >= 0) {
					outboundFormatData = dataValuestrnumbool;
				} else {
					secondObject[key] = dataValuestrnumbool;
					merged = Object.assign(outboundFormatData, secondObject, secondObject);
				}
			} else {
				var objval = {};
				outboundFormatDataParentKey.push(key);
				objval = outboundformatdata1(value, dataArr);
				outboundFormatDataParentKey = [];
				/*Object.entries(value).forEach((itementry) => {
					var [subkey, subvalue] = itementry;
					var outType = typeof(subvalue);
					// console.log("outbound subkey 1 => "+subkey);
					// console.log("outType 1 => "+outType);
					if (dataArr['@Out{'+key+'.'+subkey+'}'] != undefined) {
						var inType = typeof(dataArr['@Out{'+key+'.'+subkey+'}']);
						// console.log("inType 1 => "+inType);
						if (inType == 'object' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'array' && outType == 'string') {
							var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'.'+subkey+'}']);
						} else if (inType == 'integer' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'integer' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'number' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'number' && outType == 'boolean') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == 0) {
								var dataValuestrnumbool = false;
							} else {
								var dataValuestrnumbool = true;
							}
						} else if (inType == 'boolean' && outType == 'string') {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'].toString();
						} else if (inType == 'boolean' && outType == 'number') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else if (inType == 'boolean' && outType == 'integer') {
							if (dataArr['@Out{'+key+'.'+subkey+'}'] == false) {
								var dataValuestrnumbool = 0;
							} else {
								var dataValuestrnumbool = 1;
							}
						} else {
							var dataValuestrnumbool = dataArr['@Out{'+key+'.'+subkey+'}'];
						}
					} else {
						var dataValuestrnumbool = '';
					}
					var secondObject = merged = {};
					secondObject[subkey] = dataValuestrnumbool;;
					merged = Object.assign(objval, secondObject, secondObject);
				});*/
				var firstObject = merged1 = {};
				if (key >= 0) {
					outboundFormatData = objval;
				} else {
					firstObject[key] = objval;
					merged1 = Object.assign(outboundFormatData, firstObject);
				}
			}
		} else if (!Array.isArray(value) && value != null && typeof(value) != "object") {
			var outType = typeof(value);
			// console.log("outbound key => "+key);
			// console.log("outType => "+outType);
			if (dataArr['@Out{'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+key+'}'];
				}
			} else if (dataArr['@Out{'+firstKey+'.'+key+'}'] != undefined) {
				var inType = typeof(dataArr['@Out{'+firstKey+'.'+key+'}']);
				// console.log("inType => "+inType);
				if (inType == 'object' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'array' && outType == 'string') {
					var dataValuestrnumbool = JSON.stringify(dataArr['@Out{'+firstKey+'.'+key+'}']);
				} else if (inType == 'integer' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'integer' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'number' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'number' && outType == 'boolean') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == 0) {
						var dataValuestrnumbool = false;
					} else {
						var dataValuestrnumbool = true;
					}
				} else if (inType == 'boolean' && outType == 'string') {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'].toString();
				} else if (inType == 'boolean' && outType == 'number') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else if (inType == 'boolean' && outType == 'integer') {
					if (dataArr['@Out{'+firstKey+'.'+key+'}'] == false) {
						var dataValuestrnumbool = 0;
					} else {
						var dataValuestrnumbool = 1;
					}
				} else {
					var dataValuestrnumbool = dataArr['@Out{'+firstKey+'.'+key+'}'];
				}
			} else {
				var dataValuestrnumbool = '';
			}
			var firstObject = merged1 = {};
			if (key >= 0) {
				outboundFormatData = dataValuestrnumbool;
			} else {
				firstObject[key] = dataValuestrnumbool;
				merged1 = Object.assign(outboundFormatData, firstObject);
			}
		}
	});
	return outboundFormatData;
}

router.get('/filereader/xml', function(req, res, next) {
	var directoryPath = 'output/inbounds/user_api_data_files/RAB_20220331134532858.xml';
	try {
		const data = fs.readFileSync(directoryPath, { encoding : 'utf8', flag : 'r' });
		return res.status(200).send(data);
	} catch(error) {
		return res.json({
			code: "1",
			MsgCode: "50001",
			MsgType: "Invalid-Source",
			MsgLang: "en",
			ShortMsg: "Fail",
			LongMsg: error.message || "Some error occurred while post data in the outbound api.",
			InternalMsg: "",
			EnableAlert: "No",
			DisplayMsgBy: "LongMsg",
			Data: []
		});
	}
});

router.get('/filereader/json', function(req, res, next) {
	var directoryPath = 'output/inbounds/user_api_data_files/RAB_20220331134532858.json';
	try {
		const data = fs.readFileSync(directoryPath, { encoding : 'utf8', flag : 'r' });
		return res.status(200).send(data);
	} catch(error) {
		return res.json({
			code: "1",
			MsgCode: "50001",
			MsgType: "Invalid-Source",
			MsgLang: "en",
			ShortMsg: "Fail",
			LongMsg: error.message || "Some error occurred while post data in the outbound api.",
			InternalMsg: "",
			EnableAlert: "No",
			DisplayMsgBy: "LongMsg",
			Data: []
		});
	}
});

module.exports = router;
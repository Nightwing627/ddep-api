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
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		var typereq = reqContentType.split('/');
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
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		ddepInput += '/'+req.params.ddepInput1;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		ddepInput += '/'+req.params.ddepInput2;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		ddepInput += '/'+req.params.ddepInput3;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		ddepInput += '/'+req.params.ddepInput4;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		ddepInput += '/'+req.params.ddepInput5;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		ddepInput += '/'+req.params.ddepInput6;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		ddepInput += '/'+req.params.ddepInput7;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		ddepInput += '/'+req.params.ddepInput8;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		ddepInput += '/'+req.params.ddepInput9;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

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
		var inbound_setting = JSON.parse(response.body);
		var inbound_format = inbound_setting.Data.inbound_format;
		var project_id = inbound_setting.Data.project_id;
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

			var oldheaders = newHeader;
			// delete oldheaders['User-Agent'];
			// delete oldheaders.Accept;
			// delete oldheaders['Postman-Token'];
			delete oldheaders.Host;
			delete oldheaders['Accept-Encoding'];
			delete oldheaders.Connection;
			delete oldheaders['Content-Length'];
			var split_outbound_url = outbound_api_url.split('/');
			if (split_outbound_url.includes('dapi')) {} else {
				// delete oldheaders['Content-Type'];
			}
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url+'?'+queryString,
				'headers': oldheaders,
			};
			if (bodyreq != '') {
				if(typereq[1] == 'json') {
					options['body'] = JSON.stringify(bodyreq);
				} else if(typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml') {
					options['body'] = bodyreq;
				} else {
					options['body'] = JSON.stringify(bodyreq);
				}
			} else {
				options['formData'] = JSON.parse(JSON.stringify(responseBody.reqBody));
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
				} else {
					return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
				}
			});
		})
	});
});

router.post('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	// console.log(req);
	var reqBody = req.body;
	var reqQuery = req.query;
	var reqRawHeader = req.rawHeaders;
	console.log("rawHeaders===" + reqRawHeader);
	console.log(reqRawHeader);

	var newHeader = {};
	for (var i = 0; i < reqRawHeader.length; i++) {
		if (i % 2 == 0) {
			var key = reqRawHeader[i];
			var value = reqRawHeader[i+1];
			newHeader[key] = value;
		}
	}

	var bodyreq = '';
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		var typereq = reqContentType.split('/');
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
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		ddepInput += '/'+req.params.ddepInput1;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		ddepInput += '/'+req.params.ddepInput2;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		ddepInput += '/'+req.params.ddepInput3;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		ddepInput += '/'+req.params.ddepInput4;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		ddepInput += '/'+req.params.ddepInput5;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		ddepInput += '/'+req.params.ddepInput6;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		ddepInput += '/'+req.params.ddepInput7;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		ddepInput += '/'+req.params.ddepInput8;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		ddepInput += '/'+req.params.ddepInput9;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };

	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

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
		var inbound_setting = JSON.parse(response.body);
		var inbound_format = inbound_setting.Data.inbound_format;
		var project_id = inbound_setting.Data.project_id;
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

			var oldheaders = newHeader;
			// delete oldheaders['User-Agent'];
			// delete oldheaders.Accept;
			// delete oldheaders['Postman-Token'];
			delete oldheaders.Host;
			delete oldheaders['Accept-Encoding'];
			delete oldheaders.Connection;
			delete oldheaders['Content-Length'];
			var split_outbound_url = outbound_api_url.split('/');
			if (split_outbound_url.includes('dapi')) {} else {
				// delete oldheaders['Content-Type'];
			}
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url+'?'+queryString,
				'headers': oldheaders,
			};
			if (bodyreq != '') {
				if(typereq[1] == 'json') {
					options['body'] = JSON.stringify(bodyreq);
				} else if(typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml') {
					options['body'] = bodyreq;
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
		})
	});
});

router.put('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
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
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		var typereq = reqContentType.split('/');
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
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		ddepInput += '/'+req.params.ddepInput1;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		ddepInput += '/'+req.params.ddepInput2;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		ddepInput += '/'+req.params.ddepInput3;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		ddepInput += '/'+req.params.ddepInput4;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		ddepInput += '/'+req.params.ddepInput5;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		ddepInput += '/'+req.params.ddepInput6;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		ddepInput += '/'+req.params.ddepInput7;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		ddepInput += '/'+req.params.ddepInput8;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		ddepInput += '/'+req.params.ddepInput9;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

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
		var inbound_setting = JSON.parse(response.body);
		var inbound_format = inbound_setting.Data.inbound_format;
		var project_id = inbound_setting.Data.project_id;
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

			var oldheaders = newHeader;
			// delete oldheaders['User-Agent'];
			// delete oldheaders.Accept;
			// delete oldheaders['Postman-Token'];
			delete oldheaders.Host;
			delete oldheaders['Accept-Encoding'];
			delete oldheaders.Connection;
			delete oldheaders['Content-Length'];
			var split_outbound_url = outbound_api_url.split('/');
			if (split_outbound_url.includes('dapi')) {} else {
				// delete oldheaders['Content-Type'];
			}
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url+'?'+queryString,
				'headers': oldheaders,
			};
			if (bodyreq != '') {
				if(typereq[1] == 'json') {
					options['body'] = JSON.stringify(bodyreq);
				} else if(typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml') {
					options['body'] = bodyreq;
				} else {
					options['body'] = JSON.stringify(bodyreq);
				}
			} else {
				options['formData'] = JSON.parse(JSON.stringify(reqBody));
				//console.log("******body req null found");
				//console.log(options['formData'].length);
				//options.method = "GET";
				if(Object.entries(options.formData).length==0)
				{
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
				} else {
					return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
				}
			});
		})
	});
});

router.delete('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
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
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		var typereq = reqContentType.split('/');
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
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		ddepInput += '/'+req.params.ddepInput1;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		ddepInput += '/'+req.params.ddepInput2;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		ddepInput += '/'+req.params.ddepInput3;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		ddepInput += '/'+req.params.ddepInput4;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		ddepInput += '/'+req.params.ddepInput5;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		ddepInput += '/'+req.params.ddepInput6;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		ddepInput += '/'+req.params.ddepInput7;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		ddepInput += '/'+req.params.ddepInput8;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		ddepInput += '/'+req.params.ddepInput9;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

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
		var inbound_setting = JSON.parse(response.body);
		var inbound_format = inbound_setting.Data.inbound_format;
		var project_id = inbound_setting.Data.project_id;
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

			var oldheaders = newHeader;
			// delete oldheaders['User-Agent'];
			// delete oldheaders.Accept;
			// delete oldheaders['Postman-Token'];
			delete oldheaders.Host;
			delete oldheaders['Accept-Encoding'];
			delete oldheaders.Connection;
			delete oldheaders['Content-Length'];
			var split_outbound_url = outbound_api_url.split('/');
			if (split_outbound_url.includes('dapi')) {} else {
				// delete oldheaders['Content-Type'];
			}
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url+'?'+queryString,
				'headers': oldheaders,
			};
			if (bodyreq != '') {
				if(typereq[1] == 'json') {
					options['body'] = JSON.stringify(bodyreq);
				} else if(typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml') {
					options['body'] = bodyreq;
				} else {
					options['body'] = JSON.stringify(bodyreq);
				}
			} else {
				options['formData'] = JSON.parse(JSON.stringify(reqBody));
				//console.log("******body req null found");
				//console.log(options['formData'].length);
				//options.method = "GET";
				if(Object.entries(options.formData).length==0)
				{
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
				} else {
					return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
				}
			});
		})
	});
});

router.patch('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
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
	if (newHeader['Content-Type'] != undefined) {
		var reqContentType = newHeader['Content-Type'];
		var typereq = reqContentType.split('/');
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
	if (req.params.ddepInput1 != undefined && req.params.ddepInput1 != '') {
		ddepInput += '/'+req.params.ddepInput1;
	}
	if (req.params.ddepInput2 != undefined && req.params.ddepInput2 != '') {
		ddepInput += '/'+req.params.ddepInput2;
	}
	if (req.params.ddepInput3 != undefined && req.params.ddepInput3 != '') {
		ddepInput += '/'+req.params.ddepInput3;
	}
	if (req.params.ddepInput4 != undefined && req.params.ddepInput4 != '') {
		ddepInput += '/'+req.params.ddepInput4;
	}
	if (req.params.ddepInput5 != undefined && req.params.ddepInput5 != '') {
		ddepInput += '/'+req.params.ddepInput5;
	}
	if (req.params.ddepInput6 != undefined && req.params.ddepInput6 != '') {
		ddepInput += '/'+req.params.ddepInput6;
	}
	if (req.params.ddepInput7 != undefined && req.params.ddepInput7 != '') {
		ddepInput += '/'+req.params.ddepInput7;
	}
	if (req.params.ddepInput8 != undefined && req.params.ddepInput8 != '') {
		ddepInput += '/'+req.params.ddepInput8;
	}
	if (req.params.ddepInput9 != undefined && req.params.ddepInput9 != '') {
		ddepInput += '/'+req.params.ddepInput9;
	}
	const { headers, method, url } = req;

	var responseBody = { headers, method, url, reqBody };
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

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
		var inbound_setting = JSON.parse(response.body);
		var inbound_format = inbound_setting.Data.inbound_format;
		var project_id = inbound_setting.Data.project_id;
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

			var oldheaders = newHeader;
			// delete oldheaders['User-Agent'];
			// delete oldheaders.Accept;
			// delete oldheaders['Postman-Token'];
			delete oldheaders.Host;
			delete oldheaders['Accept-Encoding'];
			delete oldheaders.Connection;
			delete oldheaders['Content-Length'];
			var split_outbound_url = outbound_api_url.split('/');
			if (split_outbound_url.includes('dapi')) {} else {
				// delete oldheaders['Content-Type'];
			}
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url+'?'+queryString,
				'headers': oldheaders,
			};
			if (bodyreq != '') {
				if(typereq[1] == 'json') {
					options['body'] = JSON.stringify(bodyreq);
				} else if(typereq[1] == 'plain' || typereq[1] == 'html' || typereq[1] == 'javascript' || typereq[1] == 'xml') {
					options['body'] = bodyreq;
				} else {
					options['body'] = JSON.stringify(bodyreq);
				}
			} else {
				options['formData'] = JSON.parse(JSON.stringify(reqBody));
				//console.log("******body req null found");
				//console.log(options['formData'].length);
				//options.method = "GET";
				if(Object.entries(options.formData).length==0)
				{
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
				} else {
					return res.status(response.statusCode).json({"message": response.statusMessage, "http_status_code": response.statusCode});
				}
			});
		})
	});
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

	return res.status(200).send(mainObject);
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

	return res.status(200).send(mainObject);
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
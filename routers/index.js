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
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(upload.array());
router.use(express.static('public'));
router.use(bodyParser.text({ type: 'text/*' }));
router.use(bodyParser.raw({ type: 'application/*' }));
var fs = require('fs');

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
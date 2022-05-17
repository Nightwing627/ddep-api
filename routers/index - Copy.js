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
require('body-parser-xml')(bodyParser);
router.use(bodyParser.xml());
var fs = require('fs');

router.get('/', function(req, res, next) {
	//res.render('pages/dashboard-analytics', { title: 'DDEP Login' });
	res.redirect('/projects/project-list');
});

router.get('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	var reqBody = req.body;

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
	let body = [];
	
	res.statusCode = 200;
	var responseBody = { headers, method, url, reqBody };
	console.log(responseBody);
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}
	let inbound_setting;
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
					LongMsg: error.message || "Some error occurred while getting the outbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var outboundSetting = JSON.parse(body);
			var outbound_api_url = outboundSetting.api_url;

			console.log(responseBody.method);
			console.log(JSON.stringify(responseBody.reqBody));
			console.log('responseBody.headers');
			console.log(responseBody.headers);
			var oldheaders = responseBody.headers;
			delete oldheaders['user-agent'];
			delete oldheaders.accept;
			delete oldheaders['postman-token'];
			delete oldheaders.host;
			delete oldheaders['accept-encoding'];
			delete oldheaders.connection;
			delete oldheaders['content-type'];
			delete oldheaders['content-length'];
			console.log(oldheaders);
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url,
				'headers': oldheaders,
				'body': JSON.stringify(responseBody.reqBody)
			};
			request(options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log(JSON.parse(body));
				return res.json(JSON.parse(body));
			});
		})
	})
});

router.post('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	var reqBody = req.body;

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
	let body = [];
	
	res.statusCode = 200;
	var responseBody = { headers, method, url, reqBody };
	console.log(responseBody);
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}
	let inbound_setting;
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

			console.log(responseBody.method);
			console.log(JSON.stringify(responseBody.reqBody));
			console.log('responseBody.headers');
			console.log(responseBody.headers);
			var oldheaders = responseBody.headers;
			delete oldheaders['user-agent'];
			delete oldheaders.accept;
			delete oldheaders['postman-token'];
			delete oldheaders.host;
			delete oldheaders['accept-encoding'];
			delete oldheaders.connection;
			delete oldheaders['content-type'];
			delete oldheaders['content-length'];
			console.log(oldheaders);
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url,
				'headers': oldheaders,
				'body': JSON.stringify(responseBody.reqBody)
			};
			request(options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log(JSON.parse(body));
				return res.json(JSON.parse(body));
			});
		})
	})
});

router.put('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	var reqBody = req.body;

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
	let body = [];
	
	res.statusCode = 200;
	var responseBody = { headers, method, url, reqBody };
	console.log(responseBody);
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}
	let inbound_setting;
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

			console.log(responseBody.method);
			console.log(JSON.stringify(responseBody.reqBody));
			console.log('responseBody.headers');
			console.log(responseBody.headers);
			var oldheaders = responseBody.headers;
			delete oldheaders['user-agent'];
			delete oldheaders.accept;
			delete oldheaders['postman-token'];
			delete oldheaders.host;
			delete oldheaders['accept-encoding'];
			delete oldheaders.connection;
			delete oldheaders['content-type'];
			delete oldheaders['content-length'];
			console.log(oldheaders);
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url,
				'headers': oldheaders,
				'body': JSON.stringify(responseBody.reqBody)
			};
			request(options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log(JSON.parse(body));
				return res.json(JSON.parse(body));
			});
		})
	})
});

router.delete('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	var reqBody = req.body;

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
	let body = [];
	
	res.statusCode = 200;
	var responseBody = { headers, method, url, reqBody };
	console.log(responseBody);
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}
	let inbound_setting;
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
					LongMsg: error.message || "Some error occurred while getting the outbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var outboundSetting = JSON.parse(body);
			var outbound_api_url = outboundSetting.api_url;

			console.log(responseBody.method);
			console.log(JSON.stringify(responseBody.reqBody));
			console.log('responseBody.headers');
			console.log(responseBody.headers);
			var oldheaders = responseBody.headers;
			delete oldheaders['user-agent'];
			delete oldheaders.accept;
			delete oldheaders['postman-token'];
			delete oldheaders.host;
			delete oldheaders['accept-encoding'];
			delete oldheaders.connection;
			delete oldheaders['content-type'];
			delete oldheaders['content-length'];
			console.log(oldheaders);
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url,
				'headers': oldheaders,
				'body': JSON.stringify(responseBody.reqBody)
			};
			request(options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log(JSON.parse(body));
				return res.json(JSON.parse(body));
			});
		})
	})
});

router.patch('/'+config.ddepPrefix+'/:companyCode/:ddepInput/:ddepInput1?/:ddepInput2?/:ddepInput3?/:ddepInput4?/:ddepInput5?/:ddepInput6?/:ddepInput7?/:ddepInput8?/:ddepInput9?', function(req, res) {
	var reqBody = req.body;

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
	let body = [];
	
	res.statusCode = 200;
	var responseBody = { headers, method, url, reqBody };
	console.log(responseBody);
	
	var inbound_url = config.domain + "/inbound_setting/editddepAPI/";

	var inbound_options = {
		'method': 'POST',
		'url': inbound_url,
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'ddepInput': ddepInput}),
	}
	let inbound_setting;
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
					LongMsg: error.message || "Some error occurred while getting the outbound setting.",
					InternalMsg: "",
					EnableAlert: "No",
					DisplayMsgBy: "LongMsg",
					Data: []
				});
			}
			var outboundSetting = JSON.parse(body);
			var outbound_api_url = outboundSetting.api_url;

			console.log(responseBody.method);
			console.log(JSON.stringify(responseBody.reqBody));
			console.log('responseBody.headers');
			console.log(responseBody.headers);
			var oldheaders = responseBody.headers;
			delete oldheaders['user-agent'];
			delete oldheaders.accept;
			delete oldheaders['postman-token'];
			delete oldheaders.host;
			delete oldheaders['accept-encoding'];
			delete oldheaders.connection;
			delete oldheaders['content-type'];
			delete oldheaders['content-length'];
			console.log(oldheaders);
			var options = {
				'method': responseBody.method,
				'url': outbound_api_url,
				'headers': oldheaders,
				'body': JSON.stringify(responseBody.reqBody)
			};
			request(options, function (error, response, body) {
				if(error) {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: error.message || "Some error occurred while getting..",
						InternalMsg: "",
						EnableAlert: "No",
						DisplayMsgBy: "LongMsg",
						Data: []
					});
				}
				console.log(JSON.parse(body));
				return res.json(JSON.parse(body));
			});
		})
	})
});

function ddep_api(reqBody, ddepInput, res)
{
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
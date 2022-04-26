const config = require('../config/default');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var request = require('request');
const { transform, prettyPrint } = require('camaro');
var xpath = require('xpath');
var xmldom = require('xmldom');
require('body-parser-xml')(bodyParser);
router.use(bodyParser.xml());
var fs = require('fs');

router.get('/', function(req, res, next) {
	//res.render('pages/dashboard-analytics', { title: 'DDEP Login' });
	res.redirect('/projects/project-list');
});

router.get('/'+config.ddepPrefix+'/:companyCode/:ddepInput', function(req, res) {
	var reqBody = req.query;
	var ddepInput = '/'+req.params.ddepInput;

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
			var project_url = config.domain+"/projects/editAPI/"+project_id;
			request(project_url, function (error, response, pbody) {
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
				var projectSetting = JSON.parse(pbody);
				if (projectSetting.isActive != "1") {
					return res.json({
						code: "1",
						MsgCode: "50001",
						MsgType: "Invalid-Source",
						MsgLang: "en",
						ShortMsg: "Fail",
						LongMsg: "Project is not active.",
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
				if (inbound_format == 'json') {
					var object = JSON.parse(reqBody.object);
					ddep_api(object, ddepInput, res);
				} else {
					const template2 = ['//WebOrder',{
						OrderHandling:[
							'//POHeader/OrderHandling/Variable',
							{
								ID:'ID',
								Data:'Data'
							}
						],
						CustRef:[
							'//POHeader/CustRef/Variable',
							{
								ID:'ID',
								Data:'Data'
							}
						],
						SupplierDetail:['//POHeader/SupplierDetail/Variable',
							{
								ID:'ID',
								Data:'Data'
							}
						],
						ItemRefs:[
							'//POHeader/ItemRefs/Variable',
							{
								ID:'ID',
								Data:'Data'
							}
						],
						EDIHeader:{
							EDIVariables:['//EDIHeader/EDIVariables/Variable',{
								ID:"ID",
								Data:"Data"
							}],
							EDICareandContent:{
								Fibres:{
									FibreComponents_1:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[1]/Variable',{
										ID:"ID",
										Data:"Data"
									}],
									FibreComponents_2:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[2]/Variable',{
										ID:"ID",
										Data:"Data"
									}],
								},
								FrabricStatments:['//EDIHeader/EDICareandContent/FrabricStatments/Variable',{
									ID:'ID',
									Data:'Data'
								}],
								CareSymbolMappingID:['//EDIHeader/EDICareandContent/CareSymbolMappingID/Variable',{
									ID:'ID',
									Data:'Data'
								}]
							}
						},
						EDISizeDetail:{
							EDISize:['//EDISizeDetail/EDISize',{
								Variable:['//EDISizeDetail/EDISize/Variable',{
									ID:'ID',
									Data:'Data'
								}],
								MatrixDetail:['//EDISizeDetail/EDISize/MatrixDetail/Variable',{
									ID:'ID',
									Data:'Data'
								}]
							}]
						}
					}];

					var parser = new xmldom.DOMParser();
					var root = parser.parseFromString(reqBody.object, 'text/xml');
					const result = '`'+reqBody.object+'`';
					;(async function () {
						try {
							const result = await transform(reqBody.object, template2);
							var data = result;
							var nodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents', root);
							var counter = 1;
							var fibres = {};
							nodes.forEach(function(item, i) {
								var fibrecomponents = '';

								fibrecomponents = nodes[i].localName + "_" + counter;

								var Variablenodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable', root);
								var node_variable_counter = 1;
								fibres[fibrecomponents] = [];
								Variablenodes.forEach(function(item, j) {
									var id = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter +']/ID', root);
									var data = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter+']/Data', root);

									fibres[fibrecomponents][j]={'ID':id[0].firstChild.data,'Data':data[0].firstChild.data};
									node_variable_counter++;
								})
								counter++;
							});
							data[0].SupplierDetail.push({ID:"Brand",Data:"boden"});

							if (fibres.length > 0) {
								data[0].EDIHeader.EDICareandContent.Fibres = fibres;
							}

							if((data[0].EDISizeDetail.EDISize.length == undefined  || data[0].EDISizeDetail.EDISize.length == 0) && (data[0].EDISizeDetail.MatrixDetail == undefined || data[0].EDISizeDetail.MatrixDetail.length == 0)) {
								delete data[0].EDISizeDetail;
							}
							if((data[0].OrderHandeling == undefined || data[0].OrderHandeling.length == 0)) {
								delete data[0].OrderHandeling;
							}
							if((data[0].ItemRefs == undefined || data[0].ItemRefs.length == 0)) {
								delete data[0].ItemRefs;
							}
							if((data[0].CustRef == undefined || data[0].CustRef.length == 0)) {
								delete data[0].CustRef;
							}
							if((data[0].SupplierDetail == undefined || data[0].SupplierDetail.length == 0)) {
								delete data[0].SupplierDetail;
							}
							if(data[0].EDIHeader.EDICareandContent.Fibres == undefined || data[0].EDIHeader.EDICareandContent.Fibres.length == 0) {
								delete data[0].EDIHeader.EDICareandContent.Fibres;
							}
							if(data[0].EDIHeader.EDICareandContent.FrabricStatments == undefined || data[0].EDIHeader.EDICareandContent.FrabricStatments.length == 0) {
								delete data[0].EDIHeader.EDICareandContent.FrabricStatments;
							}
							if(data[0].EDIHeader.EDICareandContent.CareSymbolMappingID == undefined || data[0].EDIHeader.EDICareandContent.CareSymbolMappingID.length == 0) {
								delete data[0].EDIHeader.EDICareandContent.CareSymbolMappingID;
							}
						} catch(err) {
							console.log(err);
						}
						ddep_api(data, ddepInput, res);
					})()
				}
			});
		}
	});
});

router.post('/'+config.ddepPrefix+'/:companyCode/:ddepInput', function(req, res) {
	var reqBody = req.body;
	var ddepInput = '/'+req.params.ddepInput;
	console.log(reqBody);

	ddep_api(reqBody, ddepInput, res);

	/*var inbound_url = config.domain+"/inbound_setting/editddepAPI/";

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
			res.json({
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
			var inbound_format = inboundSetting.Data.inbound_format;
			var project_id = inboundSetting.Data.project_id;

			const template2 = ['//WebOrder',{
				OrderHandling:[
					'//POHeader/OrderHandling/Variable',
					{
						ID:'ID',
						Data:'Data'
					}
				],
				CustRef:[
					'//POHeader/CustRef/Variable',
					{
						ID:'ID',
						Data:'Data'
					}
				],
				SupplierDetail:['//POHeader/SupplierDetail/Variable',
					{
						ID:'ID',
						Data:'Data'
					}
				],
				ItemRefs:[
					'//POHeader/ItemRefs/Variable',
					{
						ID:'ID',
						Data:'Data'
					}
				],
				EDIHeader:{
					EDIVariables:['//EDIHeader/EDIVariables/Variable',{
						ID:"ID",
						Data:"Data"
					}],
					EDICareandContent:{
						Fibres:{
							FibreComponents_1:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[1]/Variable',{
								ID:"ID",
								Data:"Data"
							}],
							FibreComponents_2:['//EDIHeader/EDICareandContent/Fibre/FibreComponents[2]/Variable',{
								ID:"ID",
								Data:"Data"
							}],
						},
						FrabricStatments:['//EDIHeader/EDICareandContent/FrabricStatments/Variable',{
							ID:'ID',
							Data:'Data'
						}],
						CareSymbolMappingID:['//EDIHeader/EDICareandContent/CareSymbolMappingID/Variable',{
							ID:'ID',
							Data:'Data'
						}]
					}
				},
				EDISizeDetail:{
					EDISize:['//EDISizeDetail/EDISize',{
						Variable:['//EDISizeDetail/EDISize/Variable',{
							ID:'ID',
							Data:'Data'
						}],
						MatrixDetail:['//EDISizeDetail/EDISize/MatrixDetail/Variable',{
							ID:'ID',
							Data:'Data'
						}]
					}]
				}
			}];

			var outbound_url = config.domain+"/outbound_setting/editAPI/"+project_id;

			request(outbound_url, function (error, response, body) {
				if(error) {
					res.json({
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
				var outbound_api_url = outboundSetting.api_url
				try {
					if (inbound_format == "json") {
						var result = JSON.parse(JSON.stringify(reqBody));
						var out_data = result;
					} else {
						// var parser = new xmldom.DOMParser();
						// var root = parser.parseFromString(reqBody, 'text/xml');
						// const result = '`'+reqBody+'`';
						// ;(async function () {
						// 	try {
						// 		const result = await transform(reqBody, template2);
						// 		var data = result;
						// 		var nodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents', root);
						// 		var counter = 1;
						// 		var fibres = {};
						// 		nodes.forEach(function(item, i) {
						// 			var fibrecomponents = '';

						// 			fibrecomponents = nodes[i].localName + "_" + counter;

						// 			var Variablenodes = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable', root);
						// 			var node_variable_counter = 1;
						// 			fibres[fibrecomponents] = [];
						// 			Variablenodes.forEach(function(item, j) {
						// 				var id = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter +']/ID', root);
						// 				var data = xpath.select('//EDIHeader/EDICareandContent/Fibre/FibreComponents['+ counter +']/Variable['+node_variable_counter+']/Data', root);

						// 				fibres[fibrecomponents][j]={'ID':id[0].firstChild.data,'Data':data[0].firstChild.data};
						// 				node_variable_counter++;
						// 			})
						// 			counter++;
						// 		});
						// 		data[0].SupplierDetail.push({ID:"Brand",Data:"boden"});

						// 		data[0].EDIHeader.EDICareandContent.Fibres = fibres;

						// 		if((data[0].EDISizeDetail.EDISize.length == undefined  || data[0].EDISizeDetail.EDISize.length == 0) && (data[0].EDISizeDetail.MatrixDetail == undefined || data[0].EDISizeDetail.MatrixDetail.length == 0)) {
						// 			delete data[0].EDISizeDetail;
						// 		}
						// 		if((data[0].OrderHandeling == undefined || data[0].OrderHandeling.length == 0)) {
						// 			delete data[0].OrderHandeling;
						// 		}
						// 		if((data[0].ItemRefs == undefined || data[0].ItemRefs.length == 0)) {
						// 			delete data[0].ItemRefs;
						// 		}
						// 		if((data[0].CustRef == undefined || data[0].CustRef.length == 0)) {
						// 			delete data[0].CustRef;
						// 		}
						// 		if((data[0].SupplierDetail == undefined || data[0].SupplierDetail.length == 0)) {
						// 			delete data[0].SupplierDetail;
						// 		}
						// 		if(data[0].EDIHeader.EDICareandContent.Fibres == undefined || data[0].EDIHeader.EDICareandContent.Fibres.length == 0) {
						// 			delete data[0].EDIHeader.EDICareandContent.Fibres;
						// 		}
						// 		if(data[0].EDIHeader.EDICareandContent.FrabricStatments == undefined || data[0].EDIHeader.EDICareandContent.FrabricStatments.length == 0) {
						// 			delete data[0].EDIHeader.EDICareandContent.FrabricStatments;
						// 		}
						// 		if(data[0].EDIHeader.EDICareandContent.CareSymbolMappingID == undefined || data[0].EDIHeader.EDICareandContent.CareSymbolMappingID.length == 0) {
						// 			delete data[0].EDIHeader.EDICareandContent.CareSymbolMappingID;
						// 		}
						// 	} catch(err) {
						// 		console.log(err);
						// 	}
						// })()
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
								res.json({
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
									res.status(200).send({
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
									res.status(500).send({
										code: "1",
										MsgCode: "50001",
										MsgType: "Exception-Error",
										MsgLang: "en",
										ShortMsg: "Data Send Fail",
										LongMsg: dataoutboundres.Msg || "Some error occurred while creating the project.",
										InternalMsg: "",
										EnableAlert: "No",
										DisplayMsgBy: "LongMsg",
										Data: []
									});
								}
							} catch(e) {
								res.json({
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
					res.json({
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
		} else {
			res.json(inboundSetting);
		}
	});*/
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
			var project_url = config.domain+"/projects/editAPI/"+project_id;
			request(project_url, function (error, response, pbody) {
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

				var outbound_url = config.domain+"/outbound_setting/editAPI/"+project_id;

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
											LongMsg: dataoutboundres.Msg || "Some error occurred while creating the project.",
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
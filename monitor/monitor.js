'use strict';

const fs = require('fs');
const path = require('path');
const { tbl_app_error, tbl_app_error_config } = require('./config.js');

class monitor {
	constructor() {
		tbl_app_error_config.find().then(function(data) {
			if (data.length <= 0) {
				const config = new tbl_app_error_config({Config_Cleanup_days: "7", Config_Last_date: ""});
				config.save().then(function() {
				}).catch(function() {
				});
			}
		}).catch(function() {
		});
	}

	databaseConnectError(page, function_name, developer, error_description) {
		var filepath = './output/logs/';

		if (!fs.existsSync(filepath)) {
			fs.mkdirSync(filepath, { recursive: true });
		}

		var currentDate = new Date();
		var month = currentDate.getMonth() + 1;
		month = (month < 10 ? '0' : '') + month;
		var date = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
		var year = currentDate.getFullYear();
		var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
		var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
		var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

		var filename = date + '-' + month + '-' + year + '.log';

		var datetime = date + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second;

		var content = '=> ' + datetime + ' - ' + page + ' > ' + function_name + ' > ' + developer +' > ' + error_description;

		if (!fs.existsSync(filepath + filename)) {
			fs.writeFile(filepath + filename, content, function (err) {
				if (err) throw err;
			});
		} else {
			fs.appendFile(filepath + filename, '\n' + content, function (err) {
				if (err) throw err;
			});
		}
	}

	exceptionErrorStore(error_page, error_module, error_info, error_url, error_http_status_code, error_username, error_company_code) {
		var currentDate = new Date();
		var month = currentDate.getMonth() + 1;
		month = (month < 10 ? '0' : '') + month;
		var date = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
		var year = currentDate.getFullYear();
		var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
		var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
		var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

		var error_datetime = date + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second;
		var error_id = 1;

		let promise = new Promise(function(resolve, reject) {
			tbl_app_error.findOne({}, {}, {sort: { 'createdAt' : -1 }}).limit(1)
			.then(function(result) {
				error_id = result.Error_ID + 1;
				resolve();
			})
			.catch(function() {
				resolve();
			})
		});

		promise.then(function(result) {
			const app_error = new tbl_app_error({
				Error_ID: error_id,
				Error_Datetime: error_datetime,
				Error_Page: error_page,
				Error_Module: error_module,
				Error_Info: error_info,
				Error_URL: error_url,
				Error_HTTP_status_code: error_http_status_code,
				Error_Username: error_username,
				Error_Companycode: error_company_code
			});

			app_error.save().then(function() {
			}).catch(function() {
			});
		});
	}

	logFileCleanUp() {
		var filepath = './output/logs/';
		if (fs.existsSync(filepath)) {
			fs.readdir(filepath, function(err, files) {
				var days = 7;
				let promise = new Promise(function(resolve, reject) {
					tbl_app_error_config.findOne().limit(1)
					.then(function(result) {
						days = result.Config_Cleanup_days;
						resolve();
					})
					.catch(function() {
						resolve();
					})
				});
				promise.then(function(result) {
					files.forEach(function(file, index) {
						fs.stat(path.join(filepath, file), function(err, stat) {
							var endTime, now;
							if (err) {
								return console.error(err);
							}
							now = new Date().getTime();
							const cleanMiliseconds = 86400000 * days; // 86400000 => 1 day in miliseconds
							console.log(stat.ctime);
							/* 3600000 => 1 hour in miliseconds
							86400000 => 1 day in miliseconds
							604800000 => 7 days in miliseconds */

							/*let date_ob = new Date(stat.ctime);
							let date = (date_ob.getDate() < 10 ? '0' : '') + date_ob.getDate();
							let month = date_ob.getMonth() + 1;
							month = (month < 10 ? '0' : '') + month;
							let year = date_ob.getFullYear();
							let dateDisplay = `${year}-${month}-${date}`;*/

							endTime = new Date(stat.ctime).getTime() + cleanMiliseconds;

							var endDate = new Date(endTime);
							console.log(endDate);
							if (now > endTime) {
								console.log(filepath + file);
								fs.unlink(filepath + file, (err) => {
									if (err) {
										return console.error(err);
									}
									console.log('successfully deleted');
								})
							}
						});
					});
				});
			});
		}
	}
}
module.exports = monitor;
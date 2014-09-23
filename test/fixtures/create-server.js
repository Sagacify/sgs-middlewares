var RequestLogger = require('../../src/sgs-request-logger');

var bodyParser = require('body-parser');
var express = require('express');

module.exports = (function () {
	'use strict';

	function createServer (port, saveToDatabase) {
		var app = express();

		app.use(new RequestLogger({
			stdout: true
		}, saveToDatabase));

		app.use(bodyParser.urlencoded({
			extended: true
		}));

		app.use(bodyParser.json());

		app.get('/api/test', function (req, res) {
			console.log('HELLO - 1');
			res.status(200).end();
		});

		app
		.listen(port)
		// .on('error', callback)
		// .on('listening', callback);
	}

	return createServer;

})();
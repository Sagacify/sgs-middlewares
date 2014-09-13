var RequestLogger = require('../src/sgs-request-logger');

var bodyParser = require('body-parser');
var supertest = require('supertest');
var express = require('express');
var assert = require('assert');

module.exports = function () {
	'use strict';

	var port = 8000;

	var saveToDatabase = function (request) {

		console.log('HELLO - 2');
		console.log(request);

		it('Request log exists', function () {
			assert.equal(typeof request, 'object');
		});

		it('Request log contains id', function () {
			assert.equal(request._id.constructor.name, 'ObjectId');
		});

	};

	before(function (callback) {
		var app = express();

		app.use(new RequestLogger(saveToDatabase));
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
		.on('error', callback)
		.on('listening', callback);
	});

	it('Make request to server', function (callback) {
		supertest('http://localhost:' + port)
		.get('/api/test')
		.expect(200, callback);
	});

};

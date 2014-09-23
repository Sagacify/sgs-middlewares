var supertest = require('supertest');
var assert = require('assert');

var createServer = require('./fixtures/create-server');

module.exports = function () {
	'use strict';


	it('Simple request log', function (callback) {
		var saveToDatabase = function (request) {
			console.log(request);

			// it('Request log exists', function () {
				assert.equal(typeof request, 'object');
			// });

			// it('Request log contains id', function () {
				assert.equal(request._id.constructor.name, 'ObjectID');
			// });

			callback();
		};

		var port = 8000;

		createServer(port, saveToDatabase);

		supertest('http://127.0.0.1:' + port)
		.get('/api/test?test=lol#oki')
		.expect(200)
		.end();
	});

};

var requestLoggerTests = require('./request-logger-tests');

describe('Testing Express.js middlewares suite.', function () {
	'use strict';

	describe('Request logger', function () {
		requestLoggerTests();
	});

});

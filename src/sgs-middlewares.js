var BrowserErrorLogger = require('./sgs-browser-error-logger');
var ServerErrorLogger = require('./sgs-server-error-logger');
var RequestLogger = require('./sgs-request-logger');
var Security = require('./sgs-security');

module.exports = (function () {
	'use strict';

	var SGSMiddlewares = {
		BrowserErrorLogger: BrowserErrorLogger,
		ServerErrorLogger: ServerErrorLogger,
		RequestLogger: RequestLogger,
		Security: Security
	};

	return SGSMiddlewares;

})();

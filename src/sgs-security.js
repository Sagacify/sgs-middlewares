var helmet = require('helmet');

module.exports = (function () {
	'use strict';

	function SGSBrowserErrorLogger (config, callback) {
		if (callback === undefined) {
			callback = config;
			config = {};
		}

		config = config || {};

		this.save = callback || function () {};

		var middlewares = [];

		if (config.csp && config.csp.staticUrl && config.csp.apiUrl) {
			middlewares.push(helmet.csp({
				defaultSrc: [
					config.csp.staticUrl
				],
				connectSrc: [
					config.csp.apiUrl
				],
				setAllHeaders: false,
				reportOnly: false,
				safari5: false
			}));
		}

		middlewares = middlewares.concat([
			helmet.nosniff(),
			helmet.xssFilter(),
			helmet.xframe('deny'),
			helmet.hidePoweredBy(),
		]);

		if (config.https === true) {
			var monthMs = 1000 * 60 * 60 * 24 * 31;

			middlewares.unshift(helmet.hsts({
				maxAge: monthMs,
				includeSubdomains: true
			}));
		}

		return middlewares;
	}

	return SGSBrowserErrorLogger;

})();

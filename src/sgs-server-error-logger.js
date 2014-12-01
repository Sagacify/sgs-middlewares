module.exports = (function () {
	'use strict';

	function SGSServerErrorLogger (config, callback) {
		if (callback === undefined) {
			callback = config;
			config = {};
		}

		config = config || {};

		this.save = callback || function () {};

		return this.middleware.bind(this);
	}

	SGSServerErrorLogger.prototype.middleware = function (error, req, res, next) {
		this.save({
			pid: process.pid,
			reqId: req.data.id,
			name: error.name,
			stack: error.stack,
			message: error.message
		});

		res.status(500).json({
			error: {
				id: req.data.id,
				code: error.code,
				status: 500
			}
		});

		next = null;
	};

	return SGSServerErrorLogger;

})();

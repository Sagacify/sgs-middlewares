module.exports = (function () {
	'use strict';

	function SGSServerErrorLogger (config, saveCallback, sendCallback) {
		if (sendCallback === undefined) {
			saveCallback = config;
			sendCallback = saveCallback;
			config = {};
		}

		config = config || {};

		this.save = saveCallback || function () {};

		this.send = sendCallback;

		return this.middleware.bind(this);
	}

	SGSServerErrorLogger.prototype.middleware = function (error, req, res, next) {
		if (!(error instanceof Error)) {
			error = new Error(error);
		}

		this.save({
			pid: process.pid,
			reqId: req.data.id,
			name: error.name,
			stack: error.stack,
			message: error.message
		});

		if (this.send === undefined) {
			return res.status(500).json({
				error: {
					id: req.data.id,
					code: error.code,
					status: 500
				}
			});
		}

		this.send(error, req, res, next);
	};

	return SGSServerErrorLogger;

})();

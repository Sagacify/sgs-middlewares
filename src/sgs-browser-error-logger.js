module.exports = (function () {
	'use strict';

	function SGSBrowserErrorLogger (config, callback) {
		if (callback === undefined) {
			callback = config;
			config = {};
		}

		config = config || {};

		this.save = callback || function () {};

		return this.middleware.bind(this);
	}

	SGSBrowserErrorLogger.prototype.middleware = function (req, res) {
		this.save({
			id: req.data.id,
			name: req.body.name,
			stack: req.body.stack,
			message: req.body.message
		});

		res.status(200).end();
	};

	return SGSBrowserErrorLogger;

})();

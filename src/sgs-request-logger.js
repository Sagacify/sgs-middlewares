var onFinished = require('on-finished');
var ObjectId = require('bson').ObjectId;
var url = require('url');

module.exports = (function () {
	'use strict';

	function SGSRequestLogger (config, callback) {
		if (callback === undefined) {
			callback = config;
			config = {};
		}

		config = config || {};

		this.save = callback || function () {};

		return this.middleware.bind(this);
	}

	SGSRequestLogger.prototype.middleware = function (req, res, next) {
		req.data = req.data || {};
		req.data.id = new ObjectId();
		req.data.startTime = process.hrtime();

		onFinished(res, this.log(req, res).bind(this));

		next();
	};

	SGSRequestLogger.prototype.log = function (req, res) {
		var ipAddress = this.getIpAddress(req);

		return function (e) {
			if (e) {
				return console.log(e);
			}

			var parsedUrl = this.getParsedUrl(req);

			this.save({
				_id: req.data.id,
				pid: process.pid,
				url: {
					raw: this.getUrl(req),
					hash: parsedUrl.hash,
					path: parsedUrl.pathname,
					query: req.query,
					hostname: this.getHostname(req)
				},
				body: this.getBody(req),
				user: this.getUser(req),
				method: this.getMethod(req),
				status: this.getStatus(res),
				headers: this.getHeaders(req),
				referrer: this.getReferrer(req),
				protocol: this.getProtocol(req),
				ipAddress: ipAddress,
				userAgent: this.getUserAgent(req),
				contentType: this.getContentType(req),
				responseTime: this.getResponseTime(req)
			});
		};
	};

	SGSRequestLogger.prototype.getUrl = function (req) {
		return req.originalUrl;
	};

	SGSRequestLogger.prototype.getParsedUrl = function (req) {
		return url.parse(this.getUrl(req));
	};

	SGSRequestLogger.prototype.getBody = function (req) {
		var body = req.body;
		if (typeof body === 'string' && body.length) {
			return body;
		}
		if (typeof body === 'object' && Object.keys(body).length) {
			return body;
		}
		return null;
	};

	SGSRequestLogger.prototype.getUser = function (req) {
		return req.user ? req.user._id : null;
	};

	SGSRequestLogger.prototype.getMethod = function (req) {
		return req.method;
	};

	SGSRequestLogger.prototype.getStatus = function (res) {
		return res._header ? res.statusCode : null;
	};

	SGSRequestLogger.prototype.getHeaders = function (req) {
		return req.headers || null;
	};

	SGSRequestLogger.prototype.getHostname = function (req) {
		return req.hostname || null;
	};

	SGSRequestLogger.prototype.getReferrer = function (req) {
		return req.headers.referer || req.headers.referrer || null;
	};

	SGSRequestLogger.prototype.getProtocol = function (req) {
		return req.protocol;
	};

	SGSRequestLogger.prototype.getIpAddress = function (req) {
		return req.ips.length ? req.ips : [req.ip];
	};

	SGSRequestLogger.prototype.getUserAgent = function (req) {
		return req.headers['user-agent'] || null;
	};

	SGSRequestLogger.prototype.getContentType = function (req) {
		return req.headers['content-type'] || null;
	};

	SGSRequestLogger.prototype.getResponseTime = function (req) {
		// if(!req.data.startTime) {
		// 	return 0;
		// }

		var diff = process.hrtime(req.data.startTime);
		return +(diff[0] * 1e+3 + diff[1] * 1e-6).toFixed(3);
	};

	return SGSRequestLogger;

})();

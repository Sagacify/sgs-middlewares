var onFinished = require('on-finished');
var ObjectId = require('bson').ObjectId;
var url = require('url');

module.exports = (function () {
	'use strict';

	function SGSRequestLogger (config, callback) {
		if(callback === undefined) {
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
		return function (e) {
			if(e) {
				return console.log(e);
			}

			var url = this.getUrl(req);
			this.save({
				_id: req.data.id,
				url: {
					hash: url.hash,
					path: url.pathname,
					query: req.query,
					hostname: url.hostname
				},
				body: this.getBody(req),
				user: this.getUser(req),
				method: this.getMethod(req),
				status: this.getStatus(res),
				headers: this.getHeaders(req),
				referrer: this.getReferrer(req),
				protocol: this.getProtocol(req),
				ip_address: this.getIpAddress(req),
				content_type: this.getContentType(req),
				response_time: this.getResponseTime(req)
			});
		};
	};

	SGSRequestLogger.prototype.getUrl = function (req) {
		return url.parse(req.originalUrl);
	};

	SGSRequestLogger.prototype.getBody = function (req) {
		var body = req.body;
		if(typeof body === 'string' && body.length) {
			return body;
		}
		if(typeof body === 'object' && Object.keys(body).length) {
			return body;
		}
		return null;
	};

	SGSRequestLogger.prototype.getUser = function (req) {
		return (req.data && req.data.user) ? req.data.user._id : null;
	};

	SGSRequestLogger.prototype.getMethod = function (req) {
		return req.method;
	};

	SGSRequestLogger.prototype.getStatus = function (res) {
		return res._header ? res.statusCode : null;
	};

	SGSRequestLogger.prototype.getHeaders = function (req) {
		return req.headers;
	};

	SGSRequestLogger.prototype.getReferrer = function (req) {
		return req.headers.referer || req.headers.referrer;
	};

	SGSRequestLogger.prototype.getProtocol = function (req) {
		return req.protocol;
	};

	SGSRequestLogger.prototype.getIpAddress = function (req) {
		return req.ips.length ? req.ips : [req.ip];
	};

	SGSRequestLogger.prototype.getUserAgent = function (req) {
		return req.headers['user-agent'];
	};

	SGSRequestLogger.prototype.getContentType = function (req) {
		return req.headers['content-type'];
	};

	SGSRequestLogger.prototype.getResponseTime = function (req) {
		var diff = process.hrtime(req.data.startTime);
		return (diff[0] * 1e+3 + diff[1] * 1e-6).toFixed(3);
	};

	return SGSRequestLogger;

})();

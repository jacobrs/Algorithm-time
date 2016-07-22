module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/create', function(req, res, next) {
		viewUtils.load(res, 'room/create');
	});

	router.post('/create', function(req, res, next) {
		viewUtils.load(res, 'room/create', {success_msg: "Room created successfully!"});
	});
	return router;
}

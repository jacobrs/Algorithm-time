module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/create', function(req, res, next) {
		viewUtils.load(res, 'prob/create');
	});

	router.post('/create', function(req, res, next) {
		viewUtils.load(res, 'prob/create', {success_msg: "Problem created successfully!"});
	});
	return router;
}

module.exports = function(io){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {

		viewUtils.load(res, 'index');
	});

	return router;
}

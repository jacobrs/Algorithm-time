module.exports = function(models){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		viewUtils.initializeSession(req, {}, models, function(data){
			viewUtils.load(res, 'admin/index', data);
		});
	});

	return router;
}

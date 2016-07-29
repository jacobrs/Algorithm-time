module.exports = function(models){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		viewUtils.initializeSession(req, {}, models, function(data){
			viewUtils.load(res, 'admin/index', data);
		});
	});

	router.get('/users', function(req, res, next) {
		viewUtils.initializeSession(req, {}, models, function(data){
			if(data.loggedIn && data.user.level == viewUtils.level.ADMIN) {
				models.user_model.find({}, function(error, users){
					data.users = users;
					viewUtils.load(res, 'admin/users', data);
				});
			} else {
				res.redirect('/error');	
			}
		});
	});

	return router;
}

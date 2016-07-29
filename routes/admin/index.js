module.exports = function(models){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		viewUtils.initializeSession(req, {}, models, function(data){
			if(data.loggedIn && data.user.level == viewUtils.level.ADMIN) {
				viewUtils.load(res, 'admin/index', data);
			} else {
				res.redirect('/error');
			}
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

	router.get('/sessions', function(req, res, next) {
		viewUtils.initializeSession(req, {}, models, function(data){
			models.session_model.find({}, function(error, sessions){
				models.user_model.find({}, function(err, users){
					for(var i=0; i < sessions.length; i++) {
						sessions[i].nickname = "Not available";
						for(var j=0; j < users.length; j++) {
							if(sessions[i].id == users[j]._id) {
								sessions[i].nickname = users[i].nickname;
								break;
							}
						}
					}
					data.sessions = sessions;
					viewUtils.load(res, 'admin/sessions', data);
				});
			});
		});	
	});

	return router;
}

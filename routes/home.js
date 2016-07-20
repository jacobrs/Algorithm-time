module.exports = function(models){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		data = {};
		data = viewUtils.populateSessionData(req, data);
		viewUtils.load(res, 'index', data);
	});

	router.get('/leaderboard', function(req, res, next){
		var currUser = "";
		if(typeof req.cookies.session != "undefined"){
			currUser = req.cookies.session.user.nickname;
		}
		models.user_model.find({}, function(error, users){
			data = {users: users, currentUser: currUser};
			data = viewUtils.populateSessionData(req, data);
			viewUtils.load(res, 'leaderboard', data);
		}).sort( { score: -1 } );
	});

	router.get('/error', function(req, res, next){
		data = {error: {message: "Oups :(", stack: "There seems to be an error with this page."}};
		data = viewUtils.populateSessionData(req, data);
		viewUtils.load(res, 'error', data);
	});

	return router;
}

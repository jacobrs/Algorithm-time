module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
		data = {};
		data = viewUtils.populateSessionData(req, data);
	  res.send('All users');
	});

	router.get('/register', function(req, res, next) {
		data = {};
		data = viewUtils.populateSessionData(req, data);
		viewUtils.load(res, 'user/register');
	});

	router.get('/error', function(req, res, next){
		data = {error: {message: "Oups :(", stack: "There seems to be an error with this page."}};
		data = viewUtils.populateSessionData(req, data);
		viewUtils.load(res, 'error', data);
	});

	router.get('/guest', function(req, res, next){
		res.redirect('/error');
	});

	router.post('/register', function(req, res, next) {

		// Create a new user
		var user = new models.user_model;
		err_msg = "";
		
		// Set the data
		user.nickname = req.body.nickname;
		user.fullname = req.body.fullname;
		user.email = req.body.email;
		user.password = req.body.password;
		user.score = 0;
		user.lastLogin = "Never";

		// Logging
		console.log("Registration form submitted: " + user.nickname);

		// If no nickname selected
		if(user.nickname !== undefined && user.nickname.trim() != '') {

			// One word only
			if(user.nickname.split(' ').length == 1) {

				// Check if it's unique
				models.user_model.find({nickname: user.nickname}, function(err, users){
					
					// Already exists
					if(users.length > 0) {
						viewUtils.load(res, 'user/register', {error_msg: "This nickname already exists, please type another one"});
					} else {

						// Save new user
						user.save(function(err) {
							if(err){
								viewUtils.load(res, 'user/register', {error_msg: "Couldn't connect to DB. Try again."});
								console.log("Coudn't save user to DB: " + err);
							} else {
								viewUtils.load(res, 'user/login', {success_msg: "Successfully registered, please login."});
							}
						});
					}
				});

			} else {
				viewUtils.load(res, 'user/register', {error_msg: "Nickname should not contain spaces"});
			}
			
		} else {
			viewUtils.load(res, 'user/register', {error_msg: "Nickname is required"});
		}
	});

	router.get('/login', function(req, res, next) {
		viewUtils.load(res, 'user/login');
	});

	router.post('/login', function(req, res, next) {
		models.user_model.find({nickname: req.body.nickname, password: req.body.password}, function(err, users){
			// not valid credentials
			if(users.length < 1 || users.length > 1){
				viewUtils.load(res, 'user/login', {error_msg: "Invalid Login"});
			}else{
				var session = new models.session_model;
				session.key = "tweresde";
				var userSession = users[0];
				var password = users[0].password;
				userSession.password = null;
				session.user = userSession;
				session.ip = "";
				session.expiration = "";
				res.cookie("session", session);
				var d = new Date();
				users[0].password = password;
				users[0].lastLogin = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
				users[0].save(function(err) {
					res.redirect("../leaderboard");
				});
			}
		});
	});

	router.get('/logout', function(req, res, next) {
		res.clearCookie("session");
		data = {};
		data = viewUtils.populateSessionData(req, data);
		res.redirect("/");
	});

	return router;
}
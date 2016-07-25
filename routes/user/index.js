module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();
	var sha256 = require('js-sha256');

	function generateRandomKey(N /* size of the key */){
		return Array(N+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, N);
	}

	function getAKeyAndRedirect(session, key, user, res){
		models.session_model.find({key: key}, function(err, keys){
			if(keys.length > 0){
				console.log("Key collision handled");
				var newkey = generateRandomKey(120);
				getAKeyAndRedirect(session, newkey, user, res);
			}else{
				session.key = key;
				res.cookie("session", session);
				session.id = user._id;
				user.lastLogin = new Date();
				user.save(function(err) {
					session.save(function(err) {
						res.redirect("../leaderboard");
					});
				});
			}
		});
	}

	router.get('/', function(req, res, next) {
		data = {};
		data = viewUtils.populateSessionData(req, data);
	  res.send('All users');
	});

	router.get('/register', function(req, res, next) {
		data = {};
		user = {};
		user.nickname = "";
		user.fullname = "";
		user.email = "";
		data.user = user;
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
		user.nickname = req.body.nickname.toLowerCase();
		user.fullname = req.body.fullname;
		user.email = req.body.email.toLowerCase();
		user.password = sha256(req.body.password);
		user.score = 0;
		user.date = new Date();
		user.level = 2;
		user.lastLogin = null;

		// Logging
		console.log("Registration form submitted: " + user.nickname);

		// If no nickname selected
		if(user.nickname !== undefined && user.nickname.trim() != '') {

			// One word only
			if(user.nickname.split(' ').length == 1) {

				// Check if it's unique
				models.user_model.find({ $or: [{nickname: user.nickname}, {email: user.email}]}, function(err, users){
					
					// Already exists
					if(users.length > 0) {
						var message = "This nickname already exists, please type another one";
						if(users[0].email == user.email){
							message = "This email already exists, please type another one";
						}
						viewUtils.load(res, 'user/register', {error_msg: message, user: user});
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
		models.user_model.find({nickname: req.body.nickname, password: sha256(req.body.password)}, function(err, users){
			// not valid credentials
			if(users.length < 1 || users.length > 1){
				viewUtils.load(res, 'user/login', {error_msg: "Invalid Login"});
			}else{
				var user = users[0];
				var session = new models.session_model;
				var key = generateRandomKey(120);

				getAKeyAndRedirect(session, key, user, res);
			}
		});
	});

	router.get('/logout', function(req, res, next) {
		if(req.cookies.session != undefined){
			try{
				models.session_model.remove({key: req.cookies.session.key}, function(err, status){
					res.clearCookie("session");
					res.redirect("/");
				});
			}catch(e){
				console.log(e);
				res.redirect("/");
			}
		}else{
			res.redirect("/");
		}
	});

	return router;
}
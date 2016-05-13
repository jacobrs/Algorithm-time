module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/', function(req, res, next) {
	  res.send('All users');
	});

	router.get('/register', function(req, res, next) {
		viewUtils.load(res, 'user/register');
	});

	router.post('/register', function(req, res, next) {

		// Create a new user
		var user = new models.user_model;
		
		// Set the data
		user.nickname = req.body.nickname;
		user.fullname = req.body.fullname;
		user.email = req.body.email;

		// Logging
		console.log("Registration form submitted: " + user);

		// Save new user
		user.save(function(err) {
			if(err){
				viewUtils.load(res, 'user/register', {error_msg: "Operation failed"});
				console.log("Coudn't save user to DB: " + err);
			} else {
				viewUtils.load(res, 'user/register', {success_msg: "Registered successfully"});
			}
		});
	});

	return router;
}

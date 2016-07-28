module.exports = function(models){

	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	function adminExists() {
		var count = 0;
		models.user_model.find({level: viewUtils.level.ADMIN}, function(err, users) {
			count = users.length;
		});
		return count == 0;
	}

	router.get('/', function(req, res, next) {
		console.log(adminExists());
		if(adminExists()) {
			res.redirect('/error');
		} else {
			viewUtils.load(res, 'install/index');
		}
	});

	router.post('/', function(req, res, next) {

		if(adminExists()) {
			res.redirect('/error');
		} else {
				models.user_model.findOne({nickname: req.body.nickname}, function(err, user) {
					if(err) {
						viewUtils.load(res, 'install/index', {error_msg: "Error connecting to the database. Try again!"});
					} else {

						if(user != null) {
							console.log(user);
							models.user_model.update({nickname: req.body.nickname}, {$set: {level: viewUtils.level.ADMIN}}, {});
							viewUtils.load(res, 'install/index', {success_msg: "Nickname added as admin!"});
						} else {
							viewUtils.load(res, 'install/index', {error_msg: "Nickname not found!"});
						}
					}	
				});
		}
	});

	return router;
}

module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	var __all = function(req, res, next) {
		models.user_model.find({}, function(err, users) {
			if(err) {
				console.log("Error getting the list of users: " + err);
				viewUtils.loadAdmin(res, 'admin/user/all', {users: null});
			} else {
				viewUtils.loadAdmin(res, 'admin/user/all', {users: users});
			}
		});
	};

	router.get('/all', __all);	

	router.get('/delete/:nickname', function(req, res, next){
		models.user_model.remove({});
		models.user_model.findOneAndRemove({nickname: req.params.nickname}, function(err){
			__all(req, res, next);
		});
	});

	return router;
}

module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/all', function(req, res, next) {
		models.user_model.find({}, function(err, users) {
			if(err) {

			} else {
				viewUtils.loadAdmin(res, 'admin/user/all', {users: users});
			}
		});
	});	

	return router;
}

var utils = {};

var ObjectId = require('mongodb').ObjectID;

utils.initializeSession = function(req, data, models, callback){
	if(typeof req.cookies.session != "undefined"){
		models.session_model.find({key: req.cookies.session.key}, function(err, sessions){
			if(sessions.length == 1){
				models.user_model.findOne({_id: new ObjectId(sessions[0].id)}, function(err, user){
					data.user = user;
					data.loggedIn = true;
					callback(data);
					return false;
				});
			}else{
				data.loggedIn = false;
				callback(data);
			}
		});
	}else{
		data.loggedIn = false;
		callback(data);
	}
}

utils.populateSessionData = function(req, data){
	if(typeof req.cookies.session != "undefined"){
		data.loggedIn = true;
	}else{
		data.loggedIn = false;
	}
	return data;
}

utils.load = function(res, page, data) {
	data = typeof data !== 'undefined' ? data : {};
	data.main_page = __base + '/views/' + page;
	data.base_url = __base_url;
	data.loggedIn = (data.loggedIn == undefined || !data.loggedIn)?false:true;

	if(page == "leaderboard"){
		data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septembter", "October", "November", "December"];
	}

	res.render('template/user/template.ejs', data);
}

module.exports = utils;

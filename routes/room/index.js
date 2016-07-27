module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/create', function(req, res, next) {
		var data = {};
		viewUtils.initializeSession(req, data, models, function(data){
			if(data.user.level == 0){
				viewUtils.load(res, 'room/create', data);
			}else{
				res.redirect('all');
			}
		});
	});

	router.post('/create', function(req, res, next){
		var data = req.body;
		viewUtils.initializeSession(req, data, models, function(data){
			if(data.user.level == 0){
				models.room_model.find({}, function(err, rooms){
					
					var room = new models.room_model;
					room.room = (rooms.length == 0)?1:rooms[0].room + 1;
					if(data.title == undefined || data.title.trim() == "" || data.description.trim() == "" || data.description == undefined){
						data.error_msg = "Missing fields";
						viewUtils.load(res, 'room/create', data);
					}else{
						room.title = data.title;
						room.description = data.description;
						room.date = new Date();
						room.points = 0;
						room.save(function(err){
							if(err){
								data.error_msg = "Error Saving Room";
								viewUtils.load(res, 'room/create', data);
							}else{
								res.redirect('all');
							}
						});	
					}

				}).sort({room:-1}).limit(1);
			}
		});
	});

	router.get('/all', function(req, res, next) {
		models.room_model.find({}, function(err, rooms){
			data = {rooms:rooms};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined){
					res.redirect('/user/login');
				}else{
					viewUtils.load(res, 'room/all', data);	
				}
			});
		});
	});

	router.get('/:id(\\d+)/', function (req, res, next) {
	  var room = req.params.id;
	  models.room_model.findOne({room: room}, function(err, roomObj){
	  	data = {room:roomObj}
	  	viewUtils.initializeSession(req, data, models, function(data){
	  		models.prob_model.find({room: roomObj.room}, function(err, probs){
		  		data.probs = probs;
		  		viewUtils.load(res, 'room/index', data);
		  	}).sort({score:1});
	  	});
	  });
	});

	return router;
}

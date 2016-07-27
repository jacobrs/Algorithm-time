module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();

	router.get('/create/:id(\\d+)/', function (req, res, next) {
		models.room_model.findOne({room: req.params.id}, function(err, room){
			data = {room:room};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined || data.user.level != 0){
					res.redirect('/');
				}else{
					viewUtils.load(res, 'prob/create', data);	
				}
			});
		});
	});

	router.get('/:id(\\d+)/', function (req, res, next) {
		models.prob_model.findOne({id: req.params.id}, function(err, prob){
			data = {prob:prob};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined){
					res.redirect('/');
				}else{
					viewUtils.load(res, 'prob/index', data);	
				}
			});
		});
	});

	router.get('/create', function(req, res, next) {
		viewUtils.load(res, 'prob/create', {error_msg: "No room specified"});
	});

	router.post('/create', function(req, res, next) {
		data = req.body;
		viewUtils.initializeSession(req, data, models, function(data){
			if(data.user.level == 0){
				models.room_model.findOne({room:data.room}, function(err, room){
					models.prob_model.find({}, function(err, probs){

						var prob = new models.prob_model;
						prob.id = (probs.length == 0)?1:probs[0].id + 1;
						if(data.title == undefined || data.title.trim() == "" 
							|| data.description.trim() == "" || data.description == undefined
							|| data.score.trim() == "" || data.score == undefined){
							data.error_msg = "Missing fields";
							viewUtils.load(res, 'prob/create', data);
						}else{
							prob.title = data.title;
							prob.description = data.description;
							prob.date = new Date();
							prob.score = data.score;
							prob.room = room.room;
							room.points = room.points + prob.score;
							prob.save(function(err){
								room.save(function(err){
									if(err){
										data.error_msg = "Error Saving Prob";
										viewUtils.load(res, 'prob/create', data);
									}else{										
										res.redirect('/room/'+room.room);
									}
								});
							});	
						}
					}).sort({id:-1}).limit(1);
				});
			}
		});
	});

	return router;
}

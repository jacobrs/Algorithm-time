module.exports = function(models) {
	
	var express = require('express');
	var viewUtils = require(__base + '/libs/viewUtils');
	var router = express.Router();
	var ObjectId = require('mongodb').ObjectID;

	router.get('/review/:id(\\d+)/', function (req, res, next) {
		models.prob_model.findOne({id: req.params.id}, function(err, prob){
			data = {prob:prob};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined){
					res.redirect('/');
				}else{
					models.user_prob_model.count({user: new ObjectId(data.user._id), prob: prob.id}, function(err, count){
						if(count < 1){
							var user_prob = new models.user_prob_model;
							user_prob.user = data.user.nickname;
							user_prob.prob = prob.id;
							user_prob.score = prob.score;
							user_prob.complete = false;
							user_prob.date = new Date();
							user_prob.save(function(err){
								res.redirect('../'+prob.id);
							});	
						}else{
							res.redirect('../'+prob.id);
						}
					});	
				}
			});
		});
	});

	router.get('/complete/:id/', function (req, res, next) {
		models.user_prob_model.findOne({_id: new ObjectId(req.params.id)}, function(error, rel){
			data = {rel:rel};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined || data.user.level != viewUtils.level.ADMIN){
					res.redirect('/');
				}else{
					rel.complete = true;
					rel.save(function(err){
						res.redirect('/submissions');
					});	
				}
			});
		});
	});

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
			data = {prob:prob, submitted:false, complete:false};
			viewUtils.initializeSession(req, data, models, function(data){
				if(data.user == undefined){
					res.redirect('/');
				}else{
					models.user_prob_model.find({user: data.user.nickname, prob: prob.id}, function(err, rels){
						if(rels.length > 0){
							data.submitted = true;
							data.complete = rels[0].complete;
						}
						viewUtils.load(res, 'prob/index', data);	
					});
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

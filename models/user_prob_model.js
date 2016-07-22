var mongoose = require('mongoose');

var userProbModel = new mongoose.Schema({
	user: Number,
	prob: Number,
	score: Number,
	date: Date
});

module.exports = mongoose.model('userProb', userProbModel);

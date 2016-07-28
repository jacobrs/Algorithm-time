var mongoose = require('mongoose');

var userProbModel = new mongoose.Schema({
	user: String,
	prob: Number,
	complete: Boolean,
	date: Date
});

module.exports = mongoose.model('userProb', userProbModel);

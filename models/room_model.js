var mongoose = require('mongoose');

var probModel = new mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	points: Number,
	room: Number,
	date: Date
});

module.exports = mongoose.model('prob', probModel);

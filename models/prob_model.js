var mongoose = require('mongoose');

var roomModel = new mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	date: Date
});

module.exports = mongoose.model('room', roomModel);

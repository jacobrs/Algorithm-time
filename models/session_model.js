var mongoose = require('mongoose');

var sessionModel = new mongoose.Schema({
	key: String,
	id: Number
});

module.exports = mongoose.model('session', sessionModel);

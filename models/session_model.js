var mongoose = require('mongoose');

var sessionModel = new mongoose.Schema({
	key: String,
	expiration: String,
	ip: String,
	user: Object
});

module.exports = mongoose.model('session', sessionModel);
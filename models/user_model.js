var mongoose = require('mongoose');

var userModel = new mongoose.Schema({
	nickname: String,
	fullname: String,
	email: String
});

module.exports = mongoose.model('user', userModel);
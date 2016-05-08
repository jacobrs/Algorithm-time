var express = require('express');
var viewUtils = require(__base + '/libs/viewUtils');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('All users');
});

router.get('/register', function(req, res, next) {
	viewUtils.load(res, 'user/register');
});

router.post('/register', function(req, res, next) {

	viewUtils.load(res, 'user/register', {success_msg: "Registered successfully"});
	// viewUtils.load(res, 'user/register', {error_msg: "Operation failed"});
});

module.exports = router;

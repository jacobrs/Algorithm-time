var express = require('express');
var viewUtils = require(__base + '/libs/viewUtils');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	viewUtils.load(res, 'index');
});

module.exports = router;

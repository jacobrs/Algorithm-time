var utils = {};

utils.load = function(res, page, data) {
	data = typeof data !== 'undefined' ? data : {};
	data.main_page = __base + '/views/' + page;
	res.render('template/template.ejs', data);
}

module.exports = utils;
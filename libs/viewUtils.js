var utils = {};

utils.load = function(res, page, data) {
	data = typeof data !== 'undefined' ? data : {};
	data.main_page = __base + '/views/' + page;
	data.base_url = __base_url;
	res.render('template/template.ejs', data);
}

module.exports = utils;
var utils = {};

utils.load = function(res, page, data) {
	data = typeof data !== 'undefined' ? data : {};
	data.main_page = __base + '/views/' + page;
	data.base_url = __base_url;
	res.render('template/guest/template.ejs', data);
}

utils.loadAdmin = function(res, page, data) {
	data = typeof data !== 'undefined' ? data : {};
	data.main_page = __base + '/views/' + page;
	data.base_url = __base_url;
	res.render('template/admin/template.ejs', data);
}

module.exports = utils;

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

exports.lights_off = function(req, res) {
  res.render('lights_off', { title: 'Express' });
};

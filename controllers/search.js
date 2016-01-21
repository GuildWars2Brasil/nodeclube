exports.index = function (req, res, next) {
  var q = req.query.q;
  q = encodeURIComponent(q);
  res.redirect('https://www.google.com.br/#hl=pt-BR&q=site:www.guildwars2brasil.com.br+' + q);
};

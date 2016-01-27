'use strict';

var fs = require('fs');

module.exports = function (done) {

  var createUpload = function () {
    fs.exists('public/upload', function (exists) {
      if (!exists) {
        fs.mkdir('public/upload', done);
      } else {
        done();
      }
    });
  };

  fs.exists('config.js', function (exists) {
    if (!exists) {
      var stream = fs.createReadStream('config.default.js');
      stream.pipe(fs.createWriteStream('config.js'));
      stream.on('end', createUpload);
    } else {
      createUpload();
    }
  });
};

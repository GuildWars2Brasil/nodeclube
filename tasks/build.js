'use strict';

var spawn = require('child_process').spawn;
var gutil = require('gulp-util');

module.exports = function (done) {
  var command = './node_modules/loader-builder/bin/builder',
    params = ['views', '.'],
    child = spawn(command, params);

  gutil.log('Running', gutil.colors.cyan(command, params.join(' ')));

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', done);
};

'use strict';

var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');

// We only need build task on production enviroment
if(process.env.NODE_ENV !== 'production') {
  require('gulp-load-tasks')();
} else {
  gulp.task('default', ['build']);
}

gulp.task('build', function (done) {
  var command = './node_modules/loader-builder/bin/builder',
    params = ['views', '.'],
    child = spawn(command, params);

  gutil.log('Running', gutil.colors.cyan(command, params.join(' ')));

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', done);
});

'use strict';

var gulp = require('gulp');
var install = require('gulp-install');

module.exports = function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(install());
};

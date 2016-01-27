'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');

module.exports = [['install', 'pre-test'], function () {
  return gulp.src([
    '**/*.js',
    '!./node_modules/**',
    '!./bower_components/**',
    '!./dist/**',
    '!./public/libs/**',
    '!./test/**'
  ])
    .pipe(istanbul({
      preserveComments: true
    }))
    .pipe(istanbul.hookRequire());
}];

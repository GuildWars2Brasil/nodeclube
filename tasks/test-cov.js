'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

module.exports = [['pre-cov'], function () {
  process.env.NODE_ENV = 'test';
  var mochaStream = mocha({
    reporter: 'spec',
    require: ['should', './test/env'],
    timeout: 10000
  });
  return gulp.src('test/**/*.test.js', {read: false})
    .pipe(mochaStream)
    .pipe(istanbul.writeReports());
}];
